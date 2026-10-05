#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
README="$ROOT_DIR/README.md"

# Optional:
# If the archive is published under a fixed Pages base URL, set:
#
#   PAGES_BASE="https://USERNAME.github.io/REPOSITORY" ./generate-readme.sh
#
# When unset, Demo links remain relative.
PAGES_BASE="${PAGES_BASE:-}"

# Number of experiment cards per gallery row.
# Do not use Bash's special COLUMNS variable.
GRID_COLUMNS=3


get_report_title() {
    local report="$1"
    local experiment="$2"
    local title=""

    if [[ -f "$report" ]]; then
        title="$(
            grep -m1 -E '^#{1,3}[[:space:]]+' "$report" 2>/dev/null \
                | sed -E 's/^#{1,3}[[:space:]]+//' \
                || true
        )"
    fi

    if [[ -z "$title" ]]; then
        printf 'Experiment %s' "$experiment"
        return
    fi

    # Remove common report prefixes while keeping the meaningful title.
    title="$(
        printf '%s' "$title" | sed -E \
            -e 's/^Hello World Lab[[:space:]]*[—–-][[:space:]]*//' \
            -e 's/^Technical Report:[[:space:]]*//' \
            -e 's/^Experiment[[:space:]]+[0-9]+[[:space:]]+Technical Report:[[:space:]]*//' \
            -e 's/^Experiment[[:space:]]+[0-9]+[[:space:]]*[—–:-][[:space:]]*//' \
            -e 's/^Teknik Rapor:[[:space:]]*//' \
            -e 's/^Deney[[:space:]]+[0-9]+[[:space:]]+Teknik Raporu:[[:space:]]*//' \
            -e 's/^Deney[[:space:]]+[0-9]+[[:space:]]+Raporu:[[:space:]]*//' \
            -e 's/^Deney[[:space:]]+[0-9]+[[:space:]]*[—–:-][[:space:]]*//'
    )"

    [[ -n "$title" ]] || title="Experiment $experiment"
    printf '%s' "$title"
}


make_demo_link() {
    local relative_html="$1"

    if [[ -n "$PAGES_BASE" ]]; then
        printf '%s/%s' "${PAGES_BASE%/}" "$relative_html"
    else
        printf '%s' "$relative_html"
    fi
}


first_html_file() {
    local dir="$1"

    find "$dir" \
        -mindepth 1 \
        -maxdepth 1 \
        -type f \
        -iname '*.html' \
        -printf '%f\n' \
        2>/dev/null \
        | sort -V \
        | head -n 1
}


primary_screenshot_file() {
    local dir="$1"

    # Prefer the conventional primary screenshot.
    if [[ -f "$dir/screenshot.png" ]]; then
        printf 'screenshot.png'
        return
    fi

    # Otherwise use the first available screenshot image.
    find "$dir" \
        -mindepth 1 \
        -maxdepth 1 \
        -type f \
        \( -iname 'screenshot*.png' -o -iname 'screenshot*.jpg' -o -iname 'screenshot*.jpeg' -o -iname 'screenshot*.webp' \) \
        -printf '%f\n' \
        2>/dev/null \
        | sort -V \
        | head -n 1
}


write_package_showcase() {
    local version="$1"
    local model="$2"
    local model_dir="$ROOT_DIR/$version/$model"
    local readme_path="$model_dir/README.md"
    local rel_model_dir="$version/$model"
    local rel_readme="$rel_model_dir/README.md"

    {
        echo "## $model"
        echo
    } >> "$README"

    local summary=""
    if [[ -f "$readme_path" ]]; then
        summary="$(python3 -c '
import sys, re

path = sys.argv[1]
try:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    content = re.sub(r"<[^>]+>", "", content)
    content = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", content)
    content = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", content)
    content = re.sub(r"```.*?```", "", content, flags=re.DOTALL)
    lines = []
    for line in content.splitlines():
        line = line.strip()
        if not line or line.startswith(("#", "---", ">", "*", "-", "|")):
            if lines:
                break
            continue
        lines.append(line)
    text = " ".join(lines)
    text = re.sub(r"\s+", " ", text).strip()
    max_len = 300
    if len(text) > max_len:
        truncated = text[:max_len]
        last_space = truncated.rfind(" ")
        if last_space > 180:
            truncated = truncated[:last_space]
        text = truncated.rstrip(".,;:- ")
    print(text)
except Exception:
    pass
' "$readme_path" 2>/dev/null || true)"
    fi

    local dist_html="$model_dir/dist/index.html"
    local demo_link=""
    if [[ -f "$dist_html" ]]; then
        demo_link="$(make_demo_link "$rel_model_dir/dist/index.html")"
    fi

    {
        if [[ -n "$summary" ]]; then
            if [[ -f "$readme_path" ]]; then
                echo "${summary%.}... [Devamını oku]($rel_readme)"
            else
                echo "$summary"
            fi
            echo
        fi

        if [[ -n "$demo_link" ]]; then
            echo "[Demo]($demo_link)"
            echo
        fi
    } >> "$README"
}


write_model_gallery() {
    local version="$1"
    local model="$2"
    local model_dir="$ROOT_DIR/$version/$model"

    [[ -d "$model_dir" ]] || return 0

    if [[ -f "$model_dir/package.json" ]]; then
        write_package_showcase "$version" "$model"
        return 0
    fi

    mapfile -t experiments < <(
        find "$model_dir" \
            -mindepth 1 \
            -maxdepth 1 \
            -type d \
            -printf '%f\n' \
            2>/dev/null \
            | sort -V
    )

    local count="${#experiments[@]}"

    {
        echo "## $model"
        echo
        echo "**$count experiments**"
        echo
    } >> "$README"

    if (( count == 0 )); then
        echo "_No experiments found._" >> "$README"
        echo >> "$README"
        return 0
    fi

    local index=0

    while (( index < count )); do
        # Screenshot row.
        printf '|' >> "$README"

        for (( col=0; col<GRID_COLUMNS; col++ )); do
            local pos=$((index + col))

            if (( pos < count )); then
                local experiment="${experiments[$pos]}"
                local relative_dir="$version/$model/$experiment"
                local absolute_dir="$ROOT_DIR/$relative_dir"

                local screenshot_file
                screenshot_file="$(primary_screenshot_file "$absolute_dir" || true)"

                local html_file
                html_file="$(first_html_file "$absolute_dir" || true)"

                if [[ -n "$screenshot_file" ]]; then
                    local screenshot_path="$relative_dir/$screenshot_file"

                    if [[ -n "$html_file" ]]; then
                        local html_path="$relative_dir/$html_file"
                        printf ' [![Experiment %s](%s)](%s) |' \
                            "$experiment" \
                            "$screenshot_path" \
                            "$(make_demo_link "$html_path")" >> "$README"
                    else
                        printf ' ![Experiment %s](%s) |' \
                            "$experiment" \
                            "$screenshot_path" >> "$README"
                    fi
                else
                    printf ' **Experiment %s** |' "$experiment" >> "$README"
                fi
            else
                printf ' |' >> "$README"
            fi
        done

        # Alignment row.
        printf '\n|' >> "$README"

        for (( col=0; col<GRID_COLUMNS; col++ )); do
            printf ' :---: |' >> "$README"
        done

        # Information row.
        printf '\n|' >> "$README"

        for (( col=0; col<GRID_COLUMNS; col++ )); do
            local pos=$((index + col))

            if (( pos < count )); then
                local experiment="${experiments[$pos]}"
                local relative_dir="$version/$model/$experiment"
                local absolute_dir="$ROOT_DIR/$relative_dir"

                local report_path="$relative_dir/report.md"
                local journal_path="$relative_dir/journal.md"

                local title
                title="$(get_report_title "$ROOT_DIR/$report_path" "$experiment")"

                # Prevent Markdown table breakage.
                title="${title//|/\\|}"

                local html_file
                html_file="$(first_html_file "$absolute_dir" || true)"

                local links=()

                if [[ -n "$html_file" ]]; then
                    local html_path="$relative_dir/$html_file"
                    links+=("[Demo]($(make_demo_link "$html_path"))")
                fi

                if [[ -f "$ROOT_DIR/$report_path" ]]; then
                    links+=("[Report]($report_path)")
                fi

                if [[ -f "$ROOT_DIR/$journal_path" ]]; then
                    links+=("[Journal]($journal_path)")
                fi

                local link_text=""
                if (( ${#links[@]} > 0 )); then
                    link_text="${links[0]}"
                    for (( i=1; i<${#links[@]}; i++ )); do
                        link_text+=" · ${links[$i]}"
                    done
                fi

                if [[ -n "$link_text" ]]; then
                    printf ' **%s — %s**<br>%s |' \
                        "$experiment" \
                        "$title" \
                        "$link_text" >> "$README"
                else
                    printf ' **%s — %s** |' \
                        "$experiment" \
                        "$title" >> "$README"
                fi
            else
                printf ' |' >> "$README"
            fi
        done

        printf '\n\n' >> "$README"
        index=$((index + GRID_COLUMNS))
    done
}


cat > "$README" <<'EOF'
# Web Platform Experiments

A gallery of standalone experiments exploring native capabilities of the Web Platform through HTML, CSS, SVG, Canvas, Web APIs, graphics, animation, interaction, and related browser technologies.

Experiments are grouped by run version and model. When available, each entry links to its runnable demo, technical report, development journal, and primary visual result.

EOF


# Discover run versions automatically: v1, v2, v3, ...
mapfile -t versions < <(
    find "$ROOT_DIR" \
        -mindepth 1 \
        -maxdepth 1 \
        -type d \
        -name 'v*' \
        -printf '%f\n' \
        2>/dev/null \
        | sort -V
)

if (( ${#versions[@]} == 0 )); then
    {
        echo "---"
        echo
        echo "_No version directories matching \`v*\` were found._"
    } >> "$README"

    echo "README.md generated (no version directories found)."
    exit 0
fi


for version in "${versions[@]}"; do
    {
        echo "---"
        echo
        echo "# $version"
        echo
    } >> "$README"

    version_dir="$ROOT_DIR/$version"

    # If the version has its own prompt/specification, link it here.
    if [[ -f "$version_dir/PROMPT.md" ]]; then
        {
            echo "[View prompt]($version/PROMPT.md)"
            echo
        } >> "$README"
    fi

    # Discover model/category directories automatically.
    mapfile -t models < <(
        find "$version_dir" \
            -mindepth 1 \
            -maxdepth 1 \
            -type d \
            -printf '%f\n' \
            2>/dev/null \
            | sort -V
    )

    if (( ${#models[@]} == 0 )); then
        echo "_No model categories found._" >> "$README"
        echo >> "$README"
        continue
    fi

    for model in "${models[@]}"; do
        write_model_gallery "$version" "$model"
    done
done

echo "README.md generated."
