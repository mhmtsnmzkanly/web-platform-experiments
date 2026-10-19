# Engineering & Architecture Report: Experiment 007 (GENOME-FORGE)

## 1. Executive Summary

- **Title**: GENOME-FORGE: Evolutionary Artificial Life & Gene-Regulatory Ecosystem
- **Experiment ID**: 007
- **Deployment Path**: `/var/www/novastrum/wbe/007/`
- **Objective**: Develop an original, high-agency artificial life laboratory and synthetic biology studio featuring autonomous neural organisms undergoing Darwinian natural selection, mutation, energy metabolism, and CRISPR genetic engineering in a microscopic fluid biosphere.

---

## 2. Core Architecture & Mathematical Modeling

### 2.1 Neural Connectome (82-Parameter Brain)
Each organism possesses a compact, fully differentiated feedforward neural network:
- **Inputs (8 sensory dimensions)**:
  1. $d_{\text{food}}$: Distance to closest edible food normalized to $[0, 1]$.
  2. $\theta_{\text{food}}$: Angle to closest food relative to organism heading, normalized to $[-1, 1]$.
  3. $d_{\text{pred}}$: Distance to closest threat/predator normalized to $[0, 1]$.
  4. $\theta_{\text{pred}}$: Angle to closest predator normalized to $[-1, 1]$.
  5. $d_{\text{mate}}$: Proximity to fertile same-species mate $[0, 1]$.
  6. $\theta_{\text{mate}}$: Angle to closest mate $[-1, 1]$.
  7. $E_{\text{ratio}}$: Internal energy reserve fraction $E / E_{\max} \in [0, 1]$.
  8. $H_{\text{ratio}}$: Health status $H / 100 \in [0, 1]$.
- **Hidden Layer (6 neurons with $\tanh$ activation)**:
  $$h_j = \tanh\left(\sum_{i=0}^7 x_i W^{(1)}_{i,j} + b^{(1)}_j\right), \quad j \in \{0, \dots, 5\}$$
- **Output Layer (4 behavioral actuators)**:
  1. $o_0 = \sigma\left(\sum h_j W^{(2)}_{j,0} + b^{(2)}_0\right) \in [0, 1]$ (Locomotion forward thrust).
  2. $o_1 = \tanh\left(\sum h_j W^{(2)}_{j,1} + b^{(2)}_1\right) \in [-1, 1]$ (Rotational steering torque).
  3. $o_2 = \sigma\left(\sum h_j W^{(2)}_{j,2} + b^{(2)}_2\right) \in [0, 1]$ (Bioluminescent fluorescent signaling).
  4. $o_3 = \sigma\left(\sum h_j W^{(2)}_{j,3} + b^{(2)}_3\right) \in [0, 1]$ (Aggressive predation bite / feeding attempt).
- **Synaptic Weights**: 82 total trainable parameters stored in the genotype array.

### 2.2 Evolutionary Dynamics & Natural Selection
- **Metabolic Budgeting**: Organisms consume baseline energy proportional to cell mass and flagella count ($E_{\text{basal}}$), plus kinetic motion expenditure ($E_{\text{move}}$). Phototrophs synthesize energy through photosynthesis modulated by ambient illumination.
- **Mitosis & Heredity**: Reaching energy threshold $E \ge E_{\text{mitosis}}$ triggers cell division. Parent yields $50\%$ of energy to offspring.
- **Genetic Mutation**: Point mutations apply Gaussian drift to neural weights ($\mathcal{N}(0, 0.35)$), cell dimensions ($\pm 1.5\text{ px}$), speed ($\pm 15\text{ px/s}$), photoreceptor range ($\pm 20\text{ px}$), and flagella count, elevated $3\times$ inside radiation zones.
- **Trophic Specialization**:
  - `HERBIVORE`: Grazes on plant biomass nutrients.
  - `CARNIVORE`: Attacks organisms of smaller or differing species for energy.
  - `PHOTOTROPH`: Synthesizes metabolic energy from ambient illumination.
  - `OMNIVORE`: Opportunistic hybrid feeder.

### 2.3 Synthetic Biology: CRISPR Gene Splicer
Users can design custom species from scratch or clone specimens captured from the wild:
- Modify genotype codons (pigment hue, size, flagella, speed, sensory angle, toxin resistance, mutation rate).
- Real-time morphology preview canvas.
- Multi-organism batch inoculation directly into the live fluid biosphere.

### 2.4 Microscopic Imaging Render Modes
Four optical rendering shaders:
1. **Dark-Field**: High-contrast dark void with luminescent refraction halos around cell membranes.
2. **Phase-Contrast**: Optical diffraction rings and high internal organelle contrast.
3. **Fluorescent GFP**: Green/cyan emission visualizing live synaptic activations and nutrient digestion.
4. **Bright-Field**: Translucent illuminated fluid with absorption shading.

### 2.5 Procedural Web Audio Bio-Acoustics
- 100% procedural synthesis with zero external audio assets.
- Ambient low-pass sterile lab drone ($55\text{ Hz}$).
- Resonant frequency sweep pops on cell division ($260\text{--}680\text{ Hz}$).
- High chime notes on feeding ($880\text{--}1200\text{ Hz}$).
- Low-frequency saw wave clicks on predation strikes.
- Filtered frequency-modulated chirp on mutagenic radiation application.
