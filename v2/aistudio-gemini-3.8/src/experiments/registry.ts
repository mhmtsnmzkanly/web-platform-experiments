import React from 'react';
import { ExperimentMeta } from './types';

import Experiment01SemanticGenesis from './Experiment01SemanticGenesis';
import Experiment02CrtTerminal from './Experiment02CrtTerminal';
import Experiment03ParticleFlocking from './Experiment03ParticleFlocking';
import Experiment04BauhausAssembly from './Experiment04BauhausAssembly';
import Experiment05LiquidMercury from './Experiment05LiquidMercury';
import Experiment06MatrixCipherRain from './Experiment06MatrixCipherRain';
import Experiment07AudioWaveformSynth from './Experiment07AudioWaveformSynth';
import Experiment08BrutalistBlueprint from './Experiment08BrutalistBlueprint';
import Experiment09KineticMobiusRibbon from './Experiment09KineticMobiusRibbon';
import Experiment10AsciiQuantumField from './Experiment10AsciiQuantumField';
import Experiment11OrigamiPaperFold from './Experiment11OrigamiPaperFold';
import Experiment12GalvoLaserScanner from './Experiment12GalvoLaserScanner';
import Experiment13ZenSandRake from './Experiment13ZenSandRake';
import Experiment14CelestialOrbit from './Experiment14CelestialOrbit';
import Experiment15GlitchVhsTape from './Experiment15GlitchVhsTape';
import Experiment16ConwayGameOfLife from './Experiment16ConwayGameOfLife';
import Experiment17LetterpressStudio from './Experiment17LetterpressStudio';
import Experiment18NeonGasDischarge from './Experiment18NeonGasDischarge';
import Experiment19ElasticClothMesh from './Experiment19ElasticClothMesh';
import Experiment20PrismaticRefraction from './Experiment20PrismaticRefraction';
import Experiment21FerrofluidSpikes from './Experiment21FerrofluidSpikes';
import Experiment22RadarSonarSweep from './Experiment22RadarSonarSweep';
import Experiment23FractalTreeGrowth from './Experiment23FractalTreeGrowth';
import Experiment24HologramProjection from './Experiment24HologramProjection';
import Experiment25QuantumSuperposition from './Experiment25QuantumSuperposition';

// Studies 026 - 050
import Experiment26ThermodynamicHeatmap from './Experiment26ThermodynamicHeatmap';
import Experiment27SlitScanDistortion from './Experiment27SlitScanDistortion';
import Experiment28ChladniResonancePlates from './Experiment28ChladniResonancePlates';
import Experiment29BioluminescentDeepSea from './Experiment29BioluminescentDeepSea';
import Experiment30StroboscopicPhenakistoscope from './Experiment30StroboscopicPhenakistoscope';
import Experiment31ElectrophoreticEInk from './Experiment31ElectrophoreticEInk';
import Experiment32FluidNavierStokesSmoke from './Experiment32FluidNavierStokesSmoke';
import Experiment33IsometricVoxelMatrix from './Experiment33IsometricVoxelMatrix';
import Experiment34GeigerRadioactiveDecay from './Experiment34GeigerRadioactiveDecay';
import Experiment35AnamorphicCylinderMirror from './Experiment35AnamorphicCylinderMirror';
import Experiment36HarmonographPendulum from './Experiment36HarmonographPendulum';
import Experiment37SolarMagnetosphereAurora from './Experiment37SolarMagnetosphereAurora';
import Experiment38BrailleTactilePins from './Experiment38BrailleTactilePins';
import Experiment39HydrodynamicWaveTank from './Experiment39HydrodynamicWaveTank';
import Experiment40DiffractionGratingHolo from './Experiment40DiffractionGratingHolo';
import Experiment41SeismographTectonicNeedle from './Experiment41SeismographTectonicNeedle';
import Experiment42CymaticsLiquidVibration from './Experiment42CymaticsLiquidVibration';
import Experiment43KirlianCoronaDischarge from './Experiment43KirlianCoronaDischarge';
import Experiment44VoronoiTessellationGlass from './Experiment44VoronoiTessellationGlass';
import Experiment45MagneticCoreMemory from './Experiment45MagneticCoreMemory';
import Experiment46MicroscopicBrownianMotion from './Experiment46MicroscopicBrownianMotion';
import Experiment47NonEuclideanHyperbolicPoincare from './Experiment47NonEuclideanHyperbolicPoincare';
import Experiment48OscilloscopeVectorGameBoy from './Experiment48OscilloscopeVectorGameBoy';
import Experiment49PiezoelectricSparkGap from './Experiment49PiezoelectricSparkGap';
import Experiment50CosmicRayCloudChamber from './Experiment50CosmicRayCloudChamber';

// Studies 051 - 075
import Experiment51BirefringencePolarizedLight from './Experiment51BirefringencePolarizedLight';
import Experiment52SpirographEpicycloid from './Experiment52SpirographEpicycloid';
import Experiment53MagneticFerrofluidAudio from './Experiment53MagneticFerrofluidAudio';
import Experiment54OscilloscopeLissajous3D from './Experiment54OscilloscopeLissajous3D';
import Experiment55ReactionDiffusionTuring from './Experiment55ReactionDiffusionTuring';
import Experiment56NeonPlasmaGlobeArc from './Experiment56NeonPlasmaGlobeArc';
import Experiment57FlipDiscMatrixVane from './Experiment57FlipDiscMatrixVane';
import Experiment58MoireInterferencePatterns from './Experiment58MoireInterferencePatterns';
import Experiment59NonNewtonianOobleckShear from './Experiment59NonNewtonianOobleckShear';
import Experiment60StroboscopicWaterLevitation from './Experiment60StroboscopicWaterLevitation';
import Experiment61DendriticCrystalGrowth from './Experiment61DendriticCrystalGrowth';
import Experiment62BubbleChamberMagneticDecay from './Experiment62BubbleChamberMagneticDecay';
import Experiment63NewtonRingsInterference from './Experiment63NewtonRingsInterference';
import Experiment64SandpileSelfOrganizedCriticality from './Experiment64SandpileSelfOrganizedCriticality';
import Experiment65MechanicalJacquardLoom from './Experiment65MechanicalJacquardLoom';
import Experiment66DopplerRadarWindVelocity from './Experiment66DopplerRadarWindVelocity';
import Experiment67FiberOpticTotalInternalReflection from './Experiment67FiberOpticTotalInternalReflection';
import Experiment68AcousticLevitationNodes from './Experiment68AcousticLevitationNodes';
import Experiment69FluidMarblingEbruSuminagashi from './Experiment69FluidMarblingEbruSuminagashi';
import Experiment70SolarSpectrographFraunhofer from './Experiment70SolarSpectrographFraunhofer';
import Experiment71LiquidCrystalSchlierenTexture from './Experiment71LiquidCrystalSchlierenTexture';
import Experiment72PenroseAperiodicTiling from './Experiment72PenroseAperiodicTiling';
import Experiment73GravitationalLensingBlackHole from './Experiment73GravitationalLensingBlackHole';
import Experiment74KaleidoscopeHexagonalMirror from './Experiment74KaleidoscopeHexagonalMirror';
import Experiment75BraitenbergVehicleSensor from './Experiment75BraitenbergVehicleSensor';

// Studies 076 - 100
import Experiment76MuMetalMagneticShielding from './Experiment76MuMetalMagneticShielding';
import Experiment77HopfFibrationTorusKnot from './Experiment77HopfFibrationTorusKnot';
import Experiment78ThermographicThermalImaging from './Experiment78ThermographicThermalImaging';
import Experiment79PhosphorescentGlowWall from './Experiment79PhosphorescentGlowWall';
import Experiment80LorenzStrangeAttractor from './Experiment80LorenzStrangeAttractor';
import Experiment81NixieTubeGasDischarge from './Experiment81NixieTubeGasDischarge';
import Experiment82ChladniSandVoiceHarmonics from './Experiment82ChladniSandVoiceHarmonics';
import Experiment83KineticWindTritonWhirlwind from './Experiment83KineticWindTritonWhirlwind';
import Experiment84StereogramMagicEye3D from './Experiment84StereogramMagicEye3D';
import Experiment85MechanicalCurtaCalculator from './Experiment85MechanicalCurtaCalculator';
import Experiment86TuringPatternBiomorphMorphogenesis from './Experiment86TuringPatternBiomorphMorphogenesis';
import Experiment87PencilLeadGraphiteCircuit from './Experiment87PencilLeadGraphiteCircuit';
import Experiment88AnamorphicShadowProjection from './Experiment88AnamorphicShadowProjection';
import Experiment89ElectromagneticInductionLoop from './Experiment89ElectromagneticInductionLoop';
import Experiment90VitreousEnamelCloisonne from './Experiment90VitreousEnamelCloisonne';
import Experiment91SuperconductingMeissnerLevitation from './Experiment91SuperconductingMeissnerLevitation';
import Experiment92CatenaryChainArchArchitectural from './Experiment92CatenaryChainArchArchitectural';
import Experiment93LichtenbergHighVoltageFractal from './Experiment93LichtenbergHighVoltageFractal';
import Experiment94SonarDopplerBathymetry from './Experiment94SonarDopplerBathymetry';
import Experiment95CyanotypeSunprintPhotogram from './Experiment95CyanotypeSunprintPhotogram';
import Experiment96ResonantTeslaCoilDischarge from './Experiment96ResonantTeslaCoilDischarge';
import Experiment97MicrofluidicLabOnAChip from './Experiment97MicrofluidicLabOnAChip';
import Experiment98SeismologicalEarthquakeEpicenter from './Experiment98SeismologicalEarthquakeEpicenter';
import Experiment99QuantumHallPlateauResistance from './Experiment99QuantumHallPlateauResistance';
import Experiment100CosmicMicrowaveBackgroundRelic from './Experiment100CosmicMicrowaveBackgroundRelic';

// Studies 101 - 125
import Experiment101CherenkovRadiationReactor from './Experiment101CherenkovRadiationReactor';
import Experiment102MichelsonInterferometerLIGO from './Experiment102MichelsonInterferometerLIGO';
import Experiment103PhysarumSlimeMoldNetwork from './Experiment103PhysarumSlimeMoldNetwork';
import Experiment104SchlierenAirflowSupersonic from './Experiment104SchlierenAirflowSupersonic';
import Experiment105SternGerlachQuantumSpin from './Experiment105SternGerlachQuantumSpin';
import Experiment106BelousovZhabotinskySpiral from './Experiment106BelousovZhabotinskySpiral';
import Experiment107AntikytheraMechanismGears from './Experiment107AntikytheraMechanismGears';
import Experiment108TalbotSelfImagingGrating from './Experiment108TalbotSelfImagingGrating';
import Experiment109EnigmaRotorPermutation from './Experiment109EnigmaRotorPermutation';
import Experiment110MercuryDelayLineMemory from './Experiment110MercuryDelayLineMemory';
import Experiment111ZeemanSpectralSplitting from './Experiment111ZeemanSpectralSplitting';
import Experiment112CraigReynoldsBoidsFlock3D from './Experiment112CraigReynoldsBoidsFlock3D';
import Experiment113FoucaultPendulumPrecession from './Experiment113FoucaultPendulumPrecession';
import Experiment114KundtAcousticDustTube from './Experiment114KundtAcousticDustTube';
import Experiment115CasimirVacuumForcePlates from './Experiment115CasimirVacuumForcePlates';
import Experiment116ShepardScaleInfiniteTone from './Experiment116ShepardScaleInfiniteTone';
import Experiment117AiryDiskDiffractionPattern from './Experiment117AiryDiskDiffractionPattern';
import Experiment118MagnavoxOdysseyCRTBeam from './Experiment118MagnavoxOdysseyCRTBeam';
import Experiment119PhasedArrayBeamsteering from './Experiment119PhasedArrayBeamsteering';
import Experiment120MandelbrotFractalDeepZoom from './Experiment120MandelbrotFractalDeepZoom';
import Experiment121JosephsonJunctionSQUID from './Experiment121JosephsonJunctionSQUID';
import Experiment122WilliamsKilburnCRTMemory from './Experiment122WilliamsKilburnCRTMemory';
import Experiment123KerrElectroOpticShutter from './Experiment123KerrElectroOpticShutter';
import Experiment124CytoplasmicStreamingChloroplast from './Experiment124CytoplasmicStreamingChloroplast';
import Experiment125CavendishTorsionGravityBalance from './Experiment125CavendishTorsionGravityBalance';

// Studies 126 - 150
import Experiment126SagnacOpticalFiberGyroscope from './Experiment126SagnacOpticalFiberGyroscope';
import Experiment127RayleighBenardConvectionCells from './Experiment127RayleighBenardConvectionCells';
import Experiment128GeisslerGasDischargeTubes from './Experiment128GeisslerGasDischargeTubes';
import Experiment129TriboelectricVanDeGraaffGenerator from './Experiment129TriboelectricVanDeGraaffGenerator';
import Experiment130HopfieldAssociativeMemoryNetwork from './Experiment130HopfieldAssociativeMemoryNetwork';
import Experiment131RamanScatteringSpectroscopy from './Experiment131RamanScatteringSpectroscopy';
import Experiment132LissajousOpticalLaserHarmonics from './Experiment132LissajousOpticalLaserHarmonics';
import Experiment133PeltierThermoelectricHeatPump from './Experiment133PeltierThermoelectricHeatPump';
import Experiment134GaborHolographicWavefront from './Experiment134GaborHolographicWavefront';
import Experiment135DeBroglieMatterWaveDiffraction from './Experiment135DeBroglieMatterWaveDiffraction';
import Experiment136PulsarRadioAstronomyJocelynBell from './Experiment136PulsarRadioAstronomyJocelynBell';
import Experiment137BiotSavartMagneticLoop from './Experiment137BiotSavartMagneticLoop';
import Experiment138BrownianRatchetFeynmanSmoluchowski from './Experiment138BrownianRatchetFeynmanSmoluchowski';
import Experiment139StirlingHotAirEngine from './Experiment139StirlingHotAirEngine';
import Experiment140SchumannIonosphereResonance from './Experiment140SchumannIonosphereResonance';
import Experiment141MaxwellsDemonEntropyGate from './Experiment141MaxwellsDemonEntropyGate';
import Experiment142CrookesRadiometerVanes from './Experiment142CrookesRadiometerVanes';
import Experiment143AcoustoOpticBraggCell from './Experiment143AcoustoOpticBraggCell';
import Experiment144KleinBottleTopologicalImmerse from './Experiment144KleinBottleTopologicalImmerse';
import Experiment145HallEffectSemiconductorCarrier from './Experiment145HallEffectSemiconductorCarrier';
import Experiment146GyroscopicPrecessionNutation from './Experiment146GyroscopicPrecessionNutation';
import Experiment147WilsonCloudChamberTracks from './Experiment147WilsonCloudChamberTracks';
import Experiment148WheatstoneBridgeNullGalvo from './Experiment148WheatstoneBridgeNullGalvo';
import Experiment149BelousovZhabotinskyScrollRing from './Experiment149BelousovZhabotinskyScrollRing';
import Experiment150AntikytheraEclipsePredictor from './Experiment150AntikytheraEclipsePredictor';

// Studies 151 - 175
import Experiment151MachZehnderInterferometer from './Experiment151MachZehnderInterferometer';
import Experiment152GaltonBoardNormalDistribution from './Experiment152GaltonBoardNormalDistribution';
import Experiment153DoublePendulumChaosPoincare from './Experiment153DoublePendulumChaosPoincare';
import Experiment154KelvinHelmholtzHydrodynamicInstability from './Experiment154KelvinHelmholtzHydrodynamicInstability';
import Experiment155BarkhausenMagneticDomainJumps from './Experiment155BarkhausenMagneticDomainJumps';
import Experiment156AharonovBohmPhaseShift from './Experiment156AharonovBohmPhaseShift';
import Experiment157ChuaChaoticCircuitAttractor from './Experiment157ChuaChaoticCircuitAttractor';
import Experiment158RubensAcousticFlameTube from './Experiment158RubensAcousticFlameTube';
import Experiment159KortewegDeVriesSolitonWave from './Experiment159KortewegDeVriesSolitonWave';
import Experiment160PoyntingVectorElectromagneticFlux from './Experiment160PoyntingVectorElectromagneticFlux';
import Experiment161CladogramPhylogeneticTree from './Experiment161CladogramPhylogeneticTree';
import Experiment162SeebeckThermoelectricEMF from './Experiment162SeebeckThermoelectricEMF';
import Experiment163PoiseuilleLaminarFluidPipe from './Experiment163PoiseuilleLaminarFluidPipe';
import Experiment164RabiQuantumOscillations from './Experiment164RabiQuantumOscillations';
import Experiment165LangtonsAntCellularTuring from './Experiment165LangtonsAntCellularTuring';
import Experiment166FraunhoferDiffractionSlits from './Experiment166FraunhoferDiffractionSlits';
import Experiment167GeodesicHyperbolicTessellation from './Experiment167GeodesicHyperbolicTessellation';
import Experiment168BraggXRayCrystalDiffraction from './Experiment168BraggXRayCrystalDiffraction';
import Experiment169NavierStokesVortexSheddingVonKarman from './Experiment169NavierStokesVortexSheddingVonKarman';
import Experiment170TychonicPlanetaryEpicycles from './Experiment170TychonicPlanetaryEpicycles';
import Experiment171SuperfluidVortexLattice from './Experiment171SuperfluidVortexLattice';
import Experiment172BernoulliVenturiVacuumLift from './Experiment172BernoulliVenturiVacuumLift';
import Experiment173BlackbodyPlanckRadiationLaw from './Experiment173BlackbodyPlanckRadiationLaw';
import Experiment174LenzEddyCurrentBraking from './Experiment174LenzEddyCurrentBraking';
import Experiment175LorenzWaterWheelChaoticDynamics from './Experiment175LorenzWaterWheelChaoticDynamics';

// Studies 176 - 200
import Experiment176PhotoelectricWorkFunctionMillikan from './Experiment176PhotoelectricWorkFunctionMillikan';
import Experiment177RayleighJeansUltravioletCatastrophe from './Experiment177RayleighJeansUltravioletCatastrophe';
import Experiment178LichtenbergSurfaceDischargeTrees from './Experiment178LichtenbergSurfaceDischargeTrees';
import Experiment179TaylorCouetteVortexInstability from './Experiment179TaylorCouetteVortexInstability';
import Experiment180CoulombScatteringRutherfordNucleus from './Experiment180CoulombScatteringRutherfordNucleus';
import Experiment181ComptonPhotonWavelengthShift from './Experiment181ComptonPhotonWavelengthShift';
import Experiment182WiedemannFranzThermalConductivity from './Experiment182WiedemannFranzThermalConductivity';
import Experiment183MadelungCrystalLatticeEnergy from './Experiment183MadelungCrystalLatticeEnergy';
import Experiment184PlateauRayleighCapillaryDropletPinch from './Experiment184PlateauRayleighCapillaryDropletPinch';
import Experiment185CurieWeissFerromagneticTransition from './Experiment185CurieWeissFerromagneticTransition';
import Experiment186FaradayMagneticPolarizationRotation from './Experiment186FaradayMagneticPolarizationRotation';
import Experiment187CavitationSonoluminescenceFlash from './Experiment187CavitationSonoluminescenceFlash';
import Experiment188ZenoQuantumMeasurementFreeze from './Experiment188ZenoQuantumMeasurementFreeze';
import Experiment189BoseEinsteinCondensateVelocityDistribution from './Experiment189BoseEinsteinCondensateVelocityDistribution';
import Experiment190LarmorPrecessionMagneticMoment from './Experiment190LarmorPrecessionMagneticMoment';
import Experiment191WienBridgeAudioOscillator from './Experiment191WienBridgeAudioOscillator';
import Experiment192FrenetSerretSpaceCurveKinematics from './Experiment192FrenetSerretSpaceCurveKinematics';
import Experiment193SchrodingerCatQuantumDecoherence from './Experiment193SchrodingerCatQuantumDecoherence';
import Experiment194StefanBoltzmannRadiationThermalCube from './Experiment194StefanBoltzmannRadiationThermalCube';
import Experiment195PellianEquationDiophantineChakravala from './Experiment195PellianEquationDiophantineChakravala';
import Experiment196TuringCompleteRule110Automaton from './Experiment196TuringCompleteRule110Automaton';
import Experiment197AreciboInterstellarRadioMessage from './Experiment197AreciboInterstellarRadioMessage';
import Experiment198KaluzaKleinExtraDimensionCompact from './Experiment198KaluzaKleinExtraDimensionCompact';
import Experiment199PenroseHawkingBlackHoleSingularity from './Experiment199PenroseHawkingBlackHoleSingularity';
import Experiment200OmniSynthesisGrandFinale200 from './Experiment200OmniSynthesisGrandFinale200';

export interface ExperimentEntry {
  meta: ExperimentMeta;
  component: React.ComponentType;
}

export const EXPERIMENTS: ExperimentEntry[] = [
  {
    meta: {
      id: '001',
      number: '001',
      title: 'Semantic Genesis',
      category: 'Typography',
      tags: ['Swiss Modernism', 'Caliper Rulers', 'Kerning Analysis'],
      mechanismSignature: 'CSS Typography Metrics -> Realtime Calipers -> Letterform Lead Weight Inspection',
      designSignature: 'Typography: Instrument Serif & Sans · Color: Archival Alabaster & Antique Charcoal · Composition: Asymmetric Caliper Grid',
      description: 'The pure baseline of semantic typography: dimensional caliper rulers, tracking, leading, and baseline grid alignment.',
      keyTechnologies: ['CSS Custom Properties', 'Typography Metrics', 'SVG Baseline Grid'],
    },
    component: Experiment01SemanticGenesis,
  },
  {
    meta: {
      id: '002',
      number: '002',
      title: 'CRT Phosphor Terminal',
      category: 'Retro & Optics',
      tags: ['Cathode Ray Tube', 'P1 Green / P3 Amber', 'Web Audio Beeps', 'Scanlines'],
      mechanismSignature: 'Keystroke Buffer -> Web Audio Oscillator Blips -> Canvas Raster Scanlines -> Phosphor Decay Glow',
      designSignature: 'Typography: VT-100 Monospace · Color: P1 High-Persistence Green & P3 Amber · Composition: Barrel Curvature Frame',
      description: '1982 Raytheon phosphor cathode ray tube terminal with authentic raster scanlines, chromatic curvature, command parser, and synthesized audio blips.',
      keyTechnologies: ['Web Audio API', 'Canvas Raster Scanlines', 'CRT Curvature Shader'],
    },
    component: Experiment02CrtTerminal,
  },
  {
    meta: {
      id: '003',
      number: '003',
      title: 'Kinetic Particle Flocking',
      category: 'Simulation',
      tags: ['Boids Swarm', 'Spring Physics', 'Shockwave Detonation'],
      mechanismSignature: 'Offscreen Typography Sampling -> 1,400 Particle Targets -> Elastic Spring Damping -> Radial Cursor Shockwaves',
      designSignature: 'Typography: Syne Sans · Color: Cosmic Cyan / Deep Space Charcoal · Motion: High-velocity spring rebound',
      description: 'Over 1,400 luminous particles forming the glyphs of Hello World, scattering dynamically on cursor interaction and springing back with elastic damping.',
      keyTechnologies: ['HTML5 Canvas 2D', 'Spring Mechanics', 'Offscreen Pixel Sampling'],
    },
    component: Experiment03ParticleFlocking,
  },
  {
    meta: {
      id: '004',
      number: '004',
      title: 'Bauhaus De Stijl Constructivism',
      category: 'Typography',
      tags: ['Weimar 1919', 'De Stijl Geometry', 'Neoplasticism', 'Primary Colors'],
      mechanismSignature: 'Geometric Primitives (Arc, Block, Beam) -> Rotational Matrix -> Dimensional Assembly -> Snap Alignment',
      designSignature: 'Typography: Bold Geometric Sans · Color: Cadmium Red, Cobalt Blue, Lemon Yellow, Pitch Black · Material: Raw Linen',
      description: 'Deconstructive geometric assembly celebrating the Dessau Bauhaus and Mondrian De Stijl: rotatable circles, beams, and blocks snapping into typographic alignment.',
      keyTechnologies: ['CSS 3D Transforms', 'SVG Geometric Layout', 'Deconstructive Animation'],
    },
    component: Experiment04BauhausAssembly,
  },
  {
    meta: {
      id: '005',
      number: '005',
      title: 'Liquid Mercury Metaballs',
      category: 'Simulation',
      tags: ['Surface Tension', 'Chrome Specular', 'Metaball Fluid Dynamics'],
      mechanismSignature: 'Distance Field Equations -> Viscous Liquid Droplets -> Surface Tension Cohesion -> Specular Glare Shading',
      designSignature: 'Typography: Syne Display · Color: Liquid Chrome Silver & Studio Slate · Material: Viscous Metallic Fluid',
      description: 'Viscous mercury droplets merging and stretching across letterform gravitational pools with specular reflections and fluid surface tension.',
      keyTechnologies: ['Canvas Distance Fields', 'Specular Ray Lighting', 'Viscous Fluid Physics'],
    },
    component: Experiment05LiquidMercury,
  },
  {
    meta: {
      id: '006',
      number: '006',
      title: 'Cyber Matrix Cipher Decoder',
      category: 'Retro & Optics',
      tags: ['Digital Rain', 'Cryptographic Stream', 'Katakana Glyphs'],
      mechanismSignature: 'Falling Glyph Columns -> Cryptographic Scramble -> Hamming Distance Matching -> Phosphor Trail Persistence',
      designSignature: 'Typography: JetBrains Monospace & Syne · Color: Matrix Emerald & Blood Red · Composition: Volumetric Rain Cascade',
      description: 'High-density cybernetic rain columns streaming through virtual terminal space, dynamically unscrambling and resolving into Hello World.',
      keyTechnologies: ['Canvas Trail Blending', 'Cryptographic Scramble Logic', 'Monospace Buffer'],
    },
    component: Experiment06MatrixCipherRain,
  },
  {
    meta: {
      id: '007',
      number: '007',
      title: 'Harmonic Waveform Synthesizer',
      category: 'Audio & Signals',
      tags: ['Web Audio API', 'Oscilloscope Lissajous', 'Letter Frequencies', 'Arpeggiator'],
      mechanismSignature: 'Letter CharCode -> Musical Frequency Harmonics -> Web Audio Oscillator -> AnalyserNode Time-Domain Waveform Canvas',
      designSignature: 'Typography: Precision Sans · Color: Sky Blue Oscilloscope Trace on Deep Void · Composition: Rackmount Synthesizer Deck',
      description: 'Real-time Web Audio API synthesizer mapping each letter of Hello World to musical harmonics, rendered live on a glowing cathode oscilloscope.',
      keyTechnologies: ['Web Audio API', 'AnalyserNode FFT', 'Lissajous Beam Canvas'],
    },
    component: Experiment07AudioWaveformSynth,
  },
  {
    meta: {
      id: '008',
      number: '008',
      title: 'Architectural Brutalist Blueprint',
      category: 'Typography',
      tags: ['Drafting Board', 'Calipers', 'Structural Load', 'Stamp Tool'],
      mechanismSignature: 'Monolithic Heavy Stencil -> Drafting Dimension Calipers -> Shear Load Grid -> Interactive Inspection Stamps',
      designSignature: 'Typography: Monolithic Heavy Sans · Color: Cyanotype Blue, Safety Orange & Concrete · Composition: Technical Drafting Grid',
      description: 'Architectural drafting drawing board with dimension calipers, structural shear load stress calculations, and interactive engineering inspection stamps.',
      keyTechnologies: ['Interactive Stamp Tool', 'Dimension Calipers', 'Technical Grid Coordinate System'],
    },
    component: Experiment08BrutalistBlueprint,
  },
  {
    meta: {
      id: '009',
      number: '009',
      title: 'Kinetic Möbius Ribbon',
      category: 'Physics & Geometry',
      tags: ['Parametric Surface', '3D Coordinate Matrix', 'Iridescent Opal', 'Gyroscopic Tilt'],
      mechanismSignature: 'Parametric Equations u, v -> 3D Coordinate Rotation Matrix -> Perspective Projection -> Iridescent HSL Gradient',
      designSignature: 'Typography: Syne Display · Color: Iridescent Opal HSL Spectrum · Material: Satin Twisted Ribbon',
      description: 'Mathematical 3D Möbius ribbon twisting along a continuous non-orientable surface through Hello World space, responsive to interactive drag rotation.',
      keyTechnologies: ['Parametric Geometry', '3D Rotation Matrix', 'HSL Spectrum Shading'],
    },
    component: Experiment09KineticMobiusRibbon,
  },
  {
    meta: {
      id: '010',
      number: '010',
      title: 'ASCII Quantum Field Shading',
      category: 'Typography',
      tags: ['Lambertian Diffuse', 'Monospace Matrix', 'Text Shading', 'Normal Vectors'],
      mechanismSignature: '3D Sphere Normal Vector Dot Light Source -> Lambertian Diffuse Lighting -> Glyph Density Indexing -> ASCII Stream',
      designSignature: 'Typography: Monospace Glyph Field · Color: High-contrast Emerald on Obsidian · Composition: Full-width ASCII Matrix',
      description: 'Volumetric text shading rendered in real-time ASCII characters with adjustable diffuse light direction, surface normal calculation, and multi-alphabet sets.',
      keyTechnologies: ['Lambertian Diffuse Math', 'Monospace Buffer Rendering', 'Volumetric Shading'],
    },
    component: Experiment10AsciiQuantumField,
  },
  {
    meta: {
      id: '011',
      number: '011',
      title: 'Origami 3D Paper Fold',
      category: 'Physics & Geometry',
      tags: ['Washi Paper', 'Accordion Crease', 'Drop Shadows', 'CSS 3D'],
      mechanismSignature: 'Alternating Parity Angles -> CSS 3D rotateY -> Crease Shadow Gradients -> Ambient Occlusion Depths',
      designSignature: 'Typography: Instrument Serif · Color: Japanese Washi White, Kraft & Obsidian · Material: Fibrous Origami Paper',
      description: 'Tactile Japanese origami paper fold with realistic ambient drop shadows and accordion creases that fold and unfold into the letterforms.',
      keyTechnologies: ['CSS preserve-3d', 'Perspective Projection', 'Dynamic Cast Creases'],
    },
    component: Experiment11OrigamiPaperFold,
  },
  {
    meta: {
      id: '012',
      number: '012',
      title: 'Dual Galvo Laser Scanner',
      category: 'Retro & Optics',
      tags: ['Galvanometer Mirrors', 'DPSS 532nm Green', 'Persistence of Vision', 'Laser Bloom'],
      mechanismSignature: 'Outline Edge Extraction -> Sequential Vector Waypoints -> Beam Bloom Blur -> Galvo Deflection Mirror Angle Math',
      designSignature: 'Typography: Syne Sans · Color: DPSS 532nm Laser Green & Violet · Composition: Optical Test Bench',
      description: 'Dual-axis galvanometer laser mirror vector scanner tracing the vector paths of Hello World with high persistence of vision and optical beam bloom.',
      keyTechnologies: ['Vector Edge Detection', 'Galvanometer Angle Kinematics', 'Phosphor Persistence'],
    },
    component: Experiment12GalvoLaserScanner,
  },
  {
    meta: {
      id: '013',
      number: '013',
      title: 'Karesansui Zen Sand Rake',
      category: 'Simulation',
      tags: ['Zen Rock Garden', 'Sand Raking', 'Basalt Stones', 'Meditative Wabi-Sabi'],
      mechanismSignature: 'Mouse Drag Trajectory -> Normal Angle Offset Tines -> Dual-Stroke Furrow & Ridge -> Concentric Sand Waves',
      designSignature: 'Typography: Instrument Serif on River Basalt · Color: Warm Limestone & Charcoal Slate · Material: Raked White Gravel',
      description: 'Meditative dry-landscape Japanese rock garden where draggable rake tines carve serene wave ripples around ten basalt stones inscripted with Hello World.',
      keyTechnologies: ['Multi-Tine Rake Math', 'Interactive Canvas Surface', 'Concentric Ripple Generation'],
    },
    component: Experiment13ZenSandRake,
  },
  {
    meta: {
      id: '014',
      number: '014',
      title: 'Celestial Gravitational Orbits',
      category: 'Physics & Geometry',
      tags: ['Newtonian Gravity', 'Keplerian Ellipses', 'N-Body Dynamics', 'Orbital Trails'],
      mechanismSignature: 'Newtonian Force F=G(m1*m2)/r^2 -> Multi-Center Gravity Wells -> Keplerian Trajectory Trails -> Satellite Integration',
      designSignature: 'Typography: Celestial Serif · Color: Deep Cosmic Navy & Stellar Cyan · Composition: Astronomical Chart',
      description: 'N-body Newtonian celestial orbital mechanics where the letters of Hello World act as massive gravitational solar cores attracting orbiting planetary comets.',
      keyTechnologies: ['Newtonian N-body Gravity', 'Euler-Verlet Orbit Integration', 'Fading Trajectory Buffers'],
    },
    component: Experiment14CelestialOrbit,
  },
  {
    meta: {
      id: '015',
      number: '015',
      title: 'VCR Magnetic Tape Head Glitch',
      category: 'Retro & Optics',
      tags: ['VHS Tape 1993', 'Tracking Noise', 'RGB Chromatic Aberration', 'OSD Green'],
      mechanismSignature: 'Horizontal Scanline Displacements -> RGB Channel Offset Split -> Periodic Tracking Head Noise -> VCR OSD Phosphor',
      designSignature: 'Typography: NTSC Monospace & Heavy Sans · Color: Phosphor Green OSD & Split Chromatic RGB · Material: Analog Magnetic Tape',
      description: 'Authentic 90s VCR magnetic tape head playback simulation with tracking noise, RGB chromatic split distortion, scanline tear, and VCR transport controls.',
      keyTechnologies: ['Chromatic Aberration Offsets', 'Tracking Jitter Algorithms', 'Scanline Displacement'],
    },
    component: Experiment15GlitchVhsTape,
  },
  {
    meta: {
      id: '016',
      number: '016',
      title: 'Cellular Automata (Game of Life)',
      category: 'Simulation',
      tags: ['Conway Life', 'Bioluminescence', 'Emergent Complexity', 'Bitmask Seed'],
      mechanismSignature: 'Text Raster Bitmask -> 2D Cellular Lattice -> Moore Neighborhood Rules -> Emergent Living Colonies',
      designSignature: 'Typography: Monospace Raster · Color: Bioluminescent Emerald on Dark Laboratory Slate · Composition: Microscopic Grid Petri Dish',
      description: 'Conway’s Game of Life seeded with the exact pixel bitmask of Hello World, evolving into emergent biological cellular patterns with interactive cell injection.',
      keyTechnologies: ['Conway Cellular Automata', 'Moore Neighborhood Solver', 'Interactive Cell Injection'],
    },
    component: Experiment16ConwayGameOfLife,
  },
  {
    meta: {
      id: '017',
      number: '017',
      title: 'Movable Wood Type Letterpress',
      category: 'Typography',
      tags: ['Vandercook Press', 'Cotton Rag 300 GSM', 'Oil Ink Bleed', 'Deboss Relief'],
      mechanismSignature: 'Relief Wood Type Blocks -> Oil Ink Brayer Coverage -> Bed Pressure Impression -> Multi-Tier Text Shadow Deboss',
      designSignature: 'Typography: Woodblock Display Serif · Color: Carbon Black, Vermilion Red & Antique Parchment · Material: 300 GSM Deckle Paper',
      description: 'Movable wood type letterpress workshop with realistic ink coverage, tactile 300 GSM cotton rag paper texture, debossing depth, and proofing lever.',
      keyTechnologies: ['Multi-tier CSS Box Shadows', 'Deckle Edge Paper Emulation', 'Tactile Relief Depth'],
    },
    component: Experiment17LetterpressStudio,
  },
  {
    meta: {
      id: '018',
      number: '018',
      title: 'High-Voltage Neon Gas Discharge',
      category: 'Retro & Optics',
      tags: ['Cold Cathode Glow', '12,000V AC Transformer', 'Borosilicate Glass', 'Flicker Arc'],
      mechanismSignature: 'High-Voltage Breakdown -> Noble Gas Excitation Spectrum -> Cold-Cathode Glow Bloom -> Random Ignition Instability Flicker',
      designSignature: 'Typography: Syne Curved Neon · Color: Neon 640nm Orange-Red, Argon Cyan, Helium Gold · Material: Borosilicate Glass Tube',
      description: 'High-voltage gas discharge illumination in hand-bent glass tubes with noble gas emission spectra, transformer hum, and cold-cathode ignition flicker.',
      keyTechnologies: ['Multi-layer Gas Radiance Bloom', 'Cold-Cathode Breakdown Logic', 'Spectral Gas Emissions'],
    },
    component: Experiment18NeonGasDischarge,
  },
  {
    meta: {
      id: '019',
      number: '019',
      title: '2D Verlet Elastic Cloth Mesh',
      category: 'Physics & Geometry',
      tags: ['Verlet Integration', 'Spring Lattice', 'Wind Wave', 'Elastic Fabric'],
      mechanismSignature: '28x14 Point Lattice -> Distance Stick Relaxation (4 iterations) -> Harmonic Wind Turbulence -> Centerpiece Surface Mapping',
      designSignature: 'Typography: Syne Sans · Color: Sky Blue Silk Strands on Dark Indigo · Motion: Fluid aerodynamic wind flutter',
      description: 'Dynamic 2D Verlet physics elastic cloth textile simulation pinned in space, responding to wind gusts, gravity, and interactive mouse pulling.',
      keyTechnologies: ['Verlet Point Integration', 'Stick Constraint Relaxation', 'Interactive Fabric Tug'],
    },
    component: Experiment19ElasticClothMesh,
  },
  {
    meta: {
      id: '020',
      number: '020',
      title: 'Prismatic Snell Dispersion Caustics',
      category: 'Retro & Optics',
      tags: ['Snell Law', 'Flint Glass Prism', 'Cauchy Equation', 'Rainbow Spectrum'],
      mechanismSignature: 'Incident Ray Vector -> Snell Refraction at Glass Facet -> Cauchy Wavelength Dispersion -> Caustic Spectral Projection',
      designSignature: 'Typography: Syne Sans · Color: Full 7-band Spectral Rainbow Gradient · Composition: Optical Physics Bench',
      description: 'Optical glass prism raytracing demonstrating Snell’s Law and Cauchy dispersion, splitting a white light beam into rainbow spectral wavelengths illuminating Hello World.',
      keyTechnologies: ['Snell Refraction Trigonometry', 'Cauchy Dispersion Math', 'Spectral Ray Caustics'],
    },
    component: Experiment20PrismaticRefraction,
  },
  {
    meta: {
      id: '021',
      number: '021',
      title: 'Magnetic Ferrofluid Spikes',
      category: 'Simulation',
      tags: ['Rosensweig Instability', 'Neodymium Magnet', 'Magnetic Spikes', 'Liquid Magnetism'],
      mechanismSignature: 'Vector Distance to Magnetic Pole -> Rosensweig Instability Threshold -> Conical Spike Elongation -> Surface Liquid Clustering',
      designSignature: 'Typography: Syne Display · Color: Pitch Oily Black & Iridescent Azure · Material: Magnetic Liquid Nanoparticles',
      description: 'Magnetic ferrofluid fluid simulation where organic oily spikes form and reach toward the neodymium magnetic cursor, clustering into letterforms.',
      keyTechnologies: ['Rosensweig Instability Math', 'Conical Spike Deformation', 'Dynamic Magnetic Vector Field'],
    },
    component: Experiment21FerrofluidSpikes,
  },
  {
    meta: {
      id: '022',
      number: '022',
      title: 'Naval PPI Sonar Sweep',
      category: 'Audio & Signals',
      tags: ['Plan Position Indicator', 'Sweep Radial Line', 'Target Blips', 'Acoustic Ping'],
      mechanismSignature: 'Angular Rotating Ray Sweep -> Angular Difference Intersection -> Target Phosphor Activation -> Exponential Decay Persistence',
      designSignature: 'Typography: Syne Display · Color: Naval Phosphor Emerald & Amber · Composition: Circular Sonar Scope with Range Rings',
      description: 'Plan Position Indicator (PPI) circular naval sonar/radar sweep display detecting acoustic target echoes positioned as Hello World, with realistic phosphor persistence.',
      keyTechnologies: ['Angular Sweep Ray Scanning', 'Phosphor Persistence Falloff', 'Web Audio Sonar Ping'],
    },
    component: Experiment22RadarSonarSweep,
  },
  {
    meta: {
      id: '023',
      number: '023',
      title: 'Botanical L-System Fractal Growth',
      category: 'Simulation',
      tags: ['Lindenmayer System', 'Recursive Branching', 'Golden Ratio', 'Seasonal Foliage'],
      mechanismSignature: 'Recursive L-System Branching -> Trigonometric Vector Heading -> Golden Ratio Diminution -> Blossom Terminal Node Foliage',
      designSignature: 'Typography: Instrument Serif · Color: Sakura Blossom Pink, Pine Emerald & Autumn Orange · Composition: Etched Botanical Specimen',
      description: 'Algorithmic Lindenmayer (L-System) botanical fractal branching simulation where recursive branches blossom into foliage framing the typography.',
      keyTechnologies: ['Recursive Branch Trigonometry', 'L-System Tree Grammar', 'Seasonal Palette Modulation'],
    },
    component: Experiment23FractalTreeGrowth,
  },
  {
    meta: {
      id: '024',
      number: '024',
      title: 'Volumetric Holographic Emitter',
      category: 'Physics & Geometry',
      tags: ['Parallax Tilt', 'Interference Fringes', 'Focal Slices', 'Gyroscopic 3D'],
      mechanismSignature: 'Gyroscopic Mouse Parallax -> Multi-Z Depth Slices -> Optical Interference Fringes -> Floor Emitter Scanner Rings',
      designSignature: 'Typography: Syne Bold Display · Color: Cyan Hologram & Violet Beam · Composition: Volumetric Projection Chamber',
      description: 'Volumetric sci-fi holographic emitter projection of Hello World featuring 3D gyroscopic tilt tracking, optical interference fringes, and depth slicing.',
      keyTechnologies: ['3D Gyroscopic Parallax', 'Multi-Z Focal Slicing', 'Volumetric Radiance Rings'],
    },
    component: Experiment24HologramProjection,
  },
  {
    meta: {
      id: '025',
      number: '025',
      title: 'Quantum Wavefunction Superposition',
      category: 'Physics & Geometry',
      tags: ['Wavefunction Collapse', 'Eigenstates', 'Probability Cloud', 'Entropy Inspection'],
      mechanismSignature: 'Indeterminate Probability Cloud (|ψ⟩) -> Observer Interaction Trigger -> Instantaneous Wavefunction Collapse -> Latin Determinism',
      designSignature: 'Typography: Ancient Greek/Runic/Math Glyphs to Syne Display · Color: Quantum Ultraviolet & Electric Violet · Composition: Particle Field',
      description: 'Quantum superposition where each letter fluctuates between indeterminate eigenstates across multiple alphabets until observed, collapsing into deterministic reality.',
      keyTechnologies: ['Quantum State Simulation', 'Observer Measurement Logic', 'Entropy State Tracking'],
    },
    component: Experiment25QuantumSuperposition,
  },

  // =========================================================================
  // STUDIES 026 - 050
  // =========================================================================
  {
    meta: {
      id: '026',
      number: '026',
      title: 'Thermodynamic Infrared Heatmap',
      category: 'Simulation',
      tags: ['FLIR Camera', 'Thermal Laplacian', 'Heat Conduction', 'Isotherms'],
      mechanismSignature: 'Thermal Heat Source Cursor -> 2D Laplacian Diffusion Partial Differential Eq -> Thermal Color Transfer Function -> Isotherm Crosshairs',
      designSignature: 'Typography: Bold Monospace · Color: FLIR Ironbow Black-Purple-Red-Orange-White · Composition: Infrared Camera Viewfinder',
      description: 'Infrared thermal imaging heat camera simulation with 2D heat equation diffusion, showing thermal dissipation and temperature gradients across Hello World.',
      keyTechnologies: ['2D Laplacian Thermal Math', 'Transfer Function Palette Shaders', 'Realtime Isotherm Sampling'],
    },
    component: Experiment26ThermodynamicHeatmap,
  },
  {
    meta: {
      id: '027',
      number: '027',
      title: 'Experimental Slit-Scan Stargate',
      category: 'Retro & Optics',
      tags: ['2001 Space Odyssey', 'Slit-Scan Camera', 'Temporal Displacement', 'Anamorphic Warp'],
      mechanismSignature: 'Oscillating Kinetic Text Buffer -> Narrow Spatial Slit Window -> Time-Delayed Column Stacking -> Continuous Anamorphic Distortions',
      designSignature: 'Typography: Syne Sans · Color: Stargate Nebula Magenta, Cyan & Solar Amber · Composition: Continuous Slit Streak Panorama',
      description: 'Experimental cinema slit-scan photography simulator capturing time-delayed spatial columns of oscillating typography to produce elastic warp trails.',
      keyTechnologies: ['Slit-Scan Buffer Streaming', 'Temporal Pixel Offsets', 'ImageData Column Blitting'],
    },
    component: Experiment27SlitScanDistortion,
  },
  {
    meta: {
      id: '028',
      number: '028',
      title: 'Chladni Acoustic Resonance Nodes',
      category: 'Audio & Signals',
      tags: ['Ernst Chladni 1787', 'Plate Resonance', 'Nodal Lines', 'Sand Dynamics'],
      mechanismSignature: '2D Biharmonic Wave Equation -> Acoustic Eigenmode Gradient -> Granular Acceleration away from Antinodes -> Geometric Nodal Accumulation',
      designSignature: 'Typography: Instrument Serif · Color: Antique Brass Plate & Pure White Silica Sand · Composition: Square Resonant Plate Bed',
      description: 'Acoustic nodal plate resonance where 2,200 fine silica sand grains bounce away from vibrating antinodes to settle along zero-motion nodal geometric curves.',
      keyTechnologies: ['Chladni Modal Mathematics', 'Granular Force Fields', 'Particle Kinematics'],
    },
    component: Experiment28ChladniResonancePlates,
  },
  {
    meta: {
      id: '029',
      number: '029',
      title: 'Abyssal Bioluminescent Photophores',
      category: 'Simulation',
      tags: ['Bathypelagic Trench', 'Marine Snow', 'Siphonophores', 'Luciferin Pulse'],
      mechanismSignature: 'Hydrodynamic Fluid Drift -> Marine Snow Gravitational Settling -> Luciferin Enzymatic Photophore Pulse -> Radial Scattering Glow',
      designSignature: 'Typography: Syne Display · Color: Midnight Abyssal Navy & Bioluminescent Cyan/Emerald · Composition: Deep Oceanic Trench Viewport',
      description: 'Abyssal deep-sea trench at 3,800 meters where siphonophore colonies and comb jelly photophores emit ethereal bioluminescent flashes revealing Hello World.',
      keyTechnologies: ['Radial Photophore Shaders', 'Hydrodynamic Drift Integration', 'Luciferin Pulse Dynamics'],
    },
    component: Experiment29BioluminescentDeepSea,
  },
  {
    meta: {
      id: '030',
      number: '030',
      title: '1832 Victorian Phenakistoscope Disc',
      category: 'Retro & Optics',
      tags: ['Joseph Plateau', 'Stroboscopic Slits', 'Rotational Persistence', 'Victorian Parlor'],
      mechanismSignature: 'Angular Wheel Rotation -> Sequential 12-Phase Typographic Keyframes -> Shutter Slit Radial Mask -> Stroboscopic Eye Persistence',
      designSignature: 'Typography: Instrument Serif · Color: Antique Cardboard Parchment & Walnut Wood · Material: 19th-Century Optical Device',
      description: '1832 Victorian optical persistence animation disc: a slotted rotating wheel where sequential phases of typography spring to life through stroboscopic slits.',
      keyTechnologies: ['Radial Sector Geometry', 'Stroboscopic Shutter Math', 'Rotational Kinematics'],
    },
    component: Experiment30StroboscopicPhenakistoscope,
  },
  {
    meta: {
      id: '031',
      number: '031',
      title: 'Electrophoretic E-Ink Microcapsule',
      category: 'Typography',
      tags: ['E-Paper 300 PPI', 'Carta 1200', 'Clear Flash Refresh', '1-Bit Dither'],
      mechanismSignature: 'Charged Pigment Microcapsules (TiO2 vs Carbon) -> Voltage Inversion Pulse -> Regal Clear Flash Cycle -> Crisp 1-Bit Bistable Specimen',
      designSignature: 'Typography: Instrument Serif · Color: Matte Paper Grey & Carbon Black · Material: Reflective Electrophoretic E-Paper',
      description: 'Electrophoretic microcapsule E-Paper display simulation featuring full electronic waveform clear-flash inversion cycles and crisp 1-bit bistable pigments.',
      keyTechnologies: ['Electrophoretic Flashing States', '1-Bit High Contrast Shading', 'Bistable Paper Emulation'],
    },
    component: Experiment31ElectrophoreticEInk,
  },
  {
    meta: {
      id: '032',
      number: '032',
      title: 'Eulerian Fluid Navier-Stokes Smoke',
      category: 'Simulation',
      tags: ['Smoke Advection', 'Vortex Shedding', 'Fluid Colliders', 'Swirling Eddies'],
      mechanismSignature: 'Cursor Velocity Vector Injection -> Semi-Lagrangian Advection -> Obstacle Boundary Collider Normal -> Viscous Vortex Shedding',
      designSignature: 'Typography: Syne Sans · Color: Aurora Cyan/Emerald Smoke Plumes on Dark Void · Motion: Aerodynamic swirling eddies',
      description: 'Real-time fluid smoke simulation with Navier-Stokes advection where colored swirling smoke plumes flow and form turbulent eddies around letter colliders.',
      keyTechnologies: ['Fluid Advection Equations', 'Obstacle Boundary Reflection', 'Multi-Color Particle Buffers'],
    },
    component: Experiment32FluidNavierStokesSmoke,
  },
  {
    meta: {
      id: '033',
      number: '033',
      title: 'Isometric Voxel Heightfield Matrix',
      category: 'Physics & Geometry',
      tags: ['3D Voxels', 'Isometric 30°', 'Relief Extrusion', 'Ambient Occlusion'],
      mechanismSignature: 'Bitmap Height Matrix -> Isometric Transformation Matrix -> 3D Hexagonal Cube Shading (Top/Left/Right) -> Harmonic Relief Waves',
      designSignature: 'Typography: Blocky Isometric Sans · Color: Monolithic Concrete Grey / Cyber Cyan · Composition: 30° Axonometric Matrix',
      description: 'Chunky stylized 3D isometric voxel block grid where individual cubes extrude into spatial height reliefs forming the monolithic topography of Hello World.',
      keyTechnologies: ['Axonometric Projection Math', 'Voxel Rasterization', 'Dynamic Face Shading'],
    },
    component: Experiment33IsometricVoxelMatrix,
  },
  {
    meta: {
      id: '034',
      number: '034',
      title: 'Geiger Cloud Chamber Condensation',
      category: 'Physics & Geometry',
      tags: ['Radiation Detector', 'Alpha / Beta Decay', 'Lorentz Field', 'Web Audio Clicks'],
      mechanismSignature: 'Poisson Decay Probability -> Alpha/Beta Ionization Path -> Lorentz Magnetic Field Curvature -> Alcohol Droplet Nucleation + Audio Click',
      designSignature: 'Typography: Syne Sans · Color: Amber Alpha Tracks & Cyan Beta Spirals on Cryogenic Black · Composition: Radiation Chamber Plate',
      description: 'Wilson cloud chamber radiation counter where alpha particles and beta electrons streak through supersaturated vapor, clicking with authentic Geiger audio.',
      keyTechnologies: ['Lorentz Magnetic Curvature', 'Stochastic Poisson Decay', 'Web Audio Geiger Noise Synthesis'],
    },
    component: Experiment34GeigerRadioactiveDecay,
  },
  {
    meta: {
      id: '035',
      number: '035',
      title: '17th-C. Anamorphic Cylinder Mirror',
      category: 'Retro & Optics',
      tags: ['Catoptric Anamorphosis', 'Cylindrical Mirror', 'Radial Warp', 'Curio Chamber'],
      mechanismSignature: 'Radial Inverse Perspective Warping -> Catoptric Reflection Law -> Central Chrome Cylinder Pole -> Undistorted Virtual Restoration',
      designSignature: 'Typography: Instrument Serif & Syne · Color: Antique Walnut & Polished Chrome Mirror · Material: Catoptric Brass Desk',
      description: '17th-century catoptric cylindrical mirror anamorphosis: a distorted horseshoe radial print on the table reflects into a central polished mirror to resolve crystal clear.',
      keyTechnologies: ['Catoptric Mirror Reflection', 'Radial Coordinate Distortion', 'Polar Coordinate Mapping'],
    },
    component: Experiment35AnamorphicCylinderMirror,
  },
  {
    meta: {
      id: '036',
      number: '036',
      title: 'Harmonograph Coupled Pendulums',
      category: 'Physics & Geometry',
      tags: ['Harmonograph 1890', 'Guilloché Curves', 'Coupled Pendulums', 'Friction Decay'],
      mechanismSignature: 'Coupled Dual Pendulum Equations -> Exponential Friction Damping -> Phase Offset Integration -> Geometric Guilloché Trajectory',
      designSignature: 'Typography: Instrument Serif · Color: Gold Leaf Guilloché on Dark Velvet · Composition: Precision Drafting Plate',
      description: 'Victorian dual-pendulum drawing harmonograph machine tracing mathematical Guilloché curves that envelop Hello World with harmonic resonance decay.',
      keyTechnologies: ['Coupled Harmonic Equations', 'Friction Damping Decay', 'Parametric Curve Synthesis'],
    },
    component: Experiment36HarmonographPendulum,
  },
  {
    meta: {
      id: '037',
      number: '037',
      title: 'Solar Magnetosphere Aurora Curtains',
      category: 'Simulation',
      tags: ['Borealis Ribbon', 'Geomagnetic Storm', 'Oxygen 557nm', 'Solar Wind'],
      mechanismSignature: 'Solar Proton Wind -> Geomagnetic Dipole Funneling -> Multi-Harmonic Atmospheric Sinusoids -> Radiant Raymarch Glow',
      designSignature: 'Typography: Syne Bold · Color: Oxygen Green 557nm & Nitrogen Violet 428nm · Composition: Arctic Midnight Sky',
      description: 'Planetary magnetosphere and Aurora Borealis simulation where geomagnetic storms funnel solar wind into undulating emerald and violet atmospheric curtains.',
      keyTechnologies: ['Sinusoidal Aurora Wave Equations', 'Atmospheric Emission Gradients', 'Raymarching Radiance'],
    },
    component: Experiment37SolarMagnetosphereAurora,
  },
  {
    meta: {
      id: '038',
      number: '038',
      title: 'Motorized Tactile Pin-Matrix Bed',
      category: 'Typography',
      tags: ['Pin Art Toy', '1,568 Solenoids', 'Grade-1 Braille', 'Chrome Shading'],
      mechanismSignature: 'Typography/Braille Cell Bitmask -> Solenoid Target Strokes -> Spring Mechanical Relaxation -> 3D Chrome Specular Pins',
      designSignature: 'Typography: Grade-1 Braille & Bold Latin · Color: Machined Aluminum Grey & Chrome Silver · Composition: High-Density Pin Array',
      description: 'Motorized tactile pin-matrix array of 1,568 chrome steel pins that physically extrude in 3D relief to render Hello World in both Latin letters and Grade-1 Braille.',
      keyTechnologies: ['Tactile Matrix Displacement', 'Braille Translation Map', '3D Radial Chrome Shaders'],
    },
    component: Experiment38BrailleTactilePins,
  },
  {
    meta: {
      id: '039',
      number: '039',
      title: 'Hydrodynamic Wave Tank Caustics',
      category: 'Simulation',
      tags: ['Wave Tank', 'Shallow Water Equation', 'Underwater Caustics', 'Rain Drops'],
      mechanismSignature: '2D Shallow Water Partial Differential Eq -> Heightfield Surface Derivatives -> Optical Light Ray Refraction -> Caustic Solar Shimmer',
      designSignature: 'Typography: Bold Syne · Color: Submerged Pool Azure & Shimmering Sunlight Caustics · Material: Ceramic Mosaic Basin',
      description: 'Shallow-water wave simulation tank where interactive rain ripples refract undulating light rays onto submerged ceramic pool tiles reading Hello World.',
      keyTechnologies: ['2D Wave Partial Differential Eq', 'Caustic Optical Refraction', 'Bistable Heightfield Buffers'],
    },
    component: Experiment39HydrodynamicWaveTank,
  },
  {
    meta: {
      id: '040',
      number: '040',
      title: 'Transmission Diffraction Grating',
      category: 'Retro & Optics',
      tags: ['Laser Interference', 'Slit Pitch', 'Higher Orders', 'Wave Optics'],
      mechanismSignature: 'Laser Coherent Beam -> Transmission Micro-Slits (d) -> Fraunhofer Diffraction Formula -> Spatial Harmonic Peaks (m = 0, ±1, ±2)',
      designSignature: 'Typography: Syne Sans · Color: Laser 532nm Green / 650nm Red on Optical Bench Black · Composition: Multi-Order Spatial Array',
      description: 'Wave optics diffraction grating passing coherent laser beams through microscopic slits to produce discrete spatial interference diffraction orders.',
      keyTechnologies: ['Fraunhofer Diffraction Math', 'Wavelength Wavenumber Conversion', 'Intensity Falloff Curves'],
    },
    component: Experiment40DiffractionGratingHolo,
  },
  {
    meta: {
      id: '041',
      number: '041',
      title: 'Drum Seismograph Tectonic Needle',
      category: 'Audio & Signals',
      tags: ['Richter Scale', 'Smoked Paper Drum', 'Seismogram', 'Tectonic Tremors'],
      mechanismSignature: 'Tectonic P/S Wave Equation -> Mechanical Spring Inertia Stylus -> Rotating Smoked Drum Sweep -> Continuous Graph Inscription',
      designSignature: 'Typography: Instrument Serif Watermark · Color: Smoked Carbon Black Paper & Crimson Stylus · Composition: Cylindrical Seismogram',
      description: 'Mechanical rotating drum seismograph with vibrating recording needle inscribing continuous seismic wave traces across smoked carbon paper.',
      keyTechnologies: ['Continuous Drum Buffer Rolling', 'Mechanical Inertia Equations', 'Seismic Wave Synthesis'],
    },
    component: Experiment41SeismographTectonicNeedle,
  },
  {
    meta: {
      id: '042',
      number: '042',
      title: 'Faraday Cymatic Liquid Vibration',
      category: 'Audio & Signals',
      tags: ['Faraday Ripples', 'Petri Basin', 'Standing Waves', 'Acoustic Driver'],
      mechanismSignature: 'Pure Acoustic Frequency (Hz) -> Fluid Surface Parametric Instability -> Polygonal Standing Wave Formation -> Concentric Nodal Rings',
      designSignature: 'Typography: Syne Display · Color: Bioluminescent Azure on Dark Acoustic Slate · Composition: Circular Resonant Basin',
      description: 'Faraday liquid cymatic standing waves: a circular fluid basin vibrating under pure audio frequencies to generate geometric standing ripples around Hello World.',
      keyTechnologies: ['Faraday Instability Math', 'Polygonal Standing Wave Synthesis', 'Fluid Boundary Clipping'],
    },
    component: Experiment42CymaticsLiquidVibration,
  },
  {
    meta: {
      id: '043',
      number: '043',
      title: 'Kirlian High-Voltage Corona Aura',
      category: 'Physics & Geometry',
      tags: ['Kirlian Bio-Electrography', 'Corona Discharge', 'Dielectric Ionization', 'Plasma Sparks'],
      mechanismSignature: 'Boundary Contour Extraction -> High-Voltage RF Electric Potential (kV) -> Dielectric Air Breakdown -> Branching Plasma Streamers',
      designSignature: 'Typography: Syne Sans · Color: Electric Violet 400nm & Radiant Cyan Plasma · Composition: Photographic Emulsion Plate',
      description: 'High-voltage bio-electrographic Kirlian photography aura producing branching electrical plasma streamers discharging from the contours of Hello World.',
      keyTechnologies: ['Contour Normal Extraction', 'Dielectric Air Breakdown Math', 'Electric Branching Streamers'],
    },
    component: Experiment43KirlianCoronaDischarge,
  },
  {
    meta: {
      id: '044',
      number: '044',
      title: 'Voronoi Tessellation Stained Glass',
      category: 'Physics & Geometry',
      tags: ['Voronoi Diagram', 'Delaunay Triangulation', 'Stained Glass', 'Lloyd Relaxation'],
      mechanismSignature: 'Glyph Coordinate Seeds -> Delaunay Triangulation Dual Graph -> Voronoi Polygonal Partitioning -> Chromatic Glass Facet Shading',
      designSignature: 'Typography: Syne Sans Core · Color: Azure, Lilac, Rose & Amber Glass Facets · Composition: Faceted Geometric Crystal Matrix',
      description: 'Dynamic Voronoi mathematical cellular tessellation and Delaunay triangulation partitioning space into stained-glass crystal facets around the letterforms.',
      keyTechnologies: ['Delaunay Dual Graph Calculation', 'Voronoi Distance Partitioning', 'Cellular Polygon Shading'],
    },
    component: Experiment44VoronoiTessellationGlass,
  },
  {
    meta: {
      id: '045',
      number: '045',
      title: '1965 Apollo Ferrite Core Memory Plane',
      category: 'Retro & Optics',
      tags: ['Apollo AGC', 'Ferrite Toroids', 'Coincident-Current', 'ASCII Binary'],
      mechanismSignature: 'ASCII Character Binary Codes -> 88 Toroidal Ferrite Cores -> Coincident-Current Pulse Inversion -> Dynamic ASCII String Decoding',
      designSignature: 'Typography: Monospace Matrix & Gold Accent · Color: Copper Write Wires & Ferrite Magnet Rings · Material: Woven Memory Weave',
      description: '1965 Apollo Guidance Computer magnetic core memory plane where 88 miniature ferrite rings store the ASCII binary bits of Hello World.',
      keyTechnologies: ['Magnetic Hysteresis State Machine', 'ASCII Bitwise Parser', 'Coincident-Current Logic'],
    },
    component: Experiment45MagneticCoreMemory,
  },
  {
    meta: {
      id: '046',
      number: '046',
      title: '1827 Microscopic Brownian Diffusion',
      category: 'Simulation',
      tags: ['Robert Brown', 'Einstein-Smoluchowski', 'Colloidal Pollen', 'Stochastic Walk'],
      mechanismSignature: 'Fluid Temperature (K) -> Thermal Molecular Collision Energy -> Einstein-Smoluchowski Diffusivity -> Stochastic Random Walk Trails',
      designSignature: 'Typography: Syne Display Watermark · Color: Multi-Spectral Colloidal Particle Trails on Dark Slide · Composition: Optical Microscope Aperture',
      description: '1827 Robert Brown microscopic Brownian motion simulation: colloidal particles buffeted by invisible thermal molecular collisions tracing stochastic diffusion paths.',
      keyTechnologies: ['Einstein-Smoluchowski Diffusion Eq', 'Stochastic Random Walk Integration', 'Particle History Trails'],
    },
    component: Experiment46MicroscopicBrownianMotion,
  },
  {
    meta: {
      id: '047',
      number: '047',
      title: 'Poincaré Hyperbolic Disc Geometry',
      category: 'Physics & Geometry',
      tags: ['Non-Euclidean', 'Poincare Disc H2', 'Hyperbolic Geodesics', 'Gaussian Curvature'],
      mechanismSignature: 'Hyperbolic Metric ds^2 = 4dx^2/(1-r^2)^2 -> Poincaré Horizon Warp -> Geodesic Circular Arcs -> Non-Euclidean Scale Diminution',
      designSignature: 'Typography: Instrument Serif · Color: Electric Indigo & Frost White · Composition: Poincaré Boundary Disc',
      description: 'Non-Euclidean hyperbolic disc geometry where metric space expands exponentially toward the boundary horizon, warping Hello World along hyperbolic circular geodesics.',
      keyTechnologies: ['Poincaré Metric Mathematics', 'Hyperbolic Geodesic Projection', 'Non-Euclidean Diminution Math'],
    },
    component: Experiment47NonEuclideanHyperbolicPoincare,
  },
  {
    meta: {
      id: '048',
      number: '048',
      title: '1989 Dot Matrix 4-Shade LCD (DMG-01)',
      category: 'Retro & Optics',
      tags: ['Game Boy LCD', '4-Shade Olive Green', 'Chiptune Square Wave', '160x144 Pixel'],
      mechanismSignature: '160x144 Dot-Matrix Pixel Pipeline -> 4-Shade Olive Green LUT (#0f380f to #9bbc0f) -> Contrast Dial Scaling -> 8-Bit Pulse Chiptune Web Audio',
      designSignature: 'Typography: 8-Bit Dot Matrix Bitmap · Color: 4-Shade Olive Green DMG LCD & Grey Plastic Bezel · Composition: Vintage Handheld Console Housing',
      description: '1989 handheld console dot-matrix reflective LCD simulation featuring authentic 4-shade olive green palette, pixel ghosting, D-pad controls, and 8-bit chiptune audio.',
      keyTechnologies: ['4-Shade Monochrome LUT', 'Web Audio 8-Bit Pulse Oscillator', 'Bitmap Font Scaling'],
    },
    component: Experiment48OscilloscopeVectorGameBoy,
  },
  {
    meta: {
      id: '049',
      number: '049',
      title: 'Piezoelectric Quartz Spark Gap',
      category: 'Physics & Geometry',
      tags: ['Piezoelectric Crystal', 'Dielectric Breakdown', 'Tungsten Electrodes', 'Audio Spark Snap'],
      mechanismSignature: 'Mechanical Hammer Strike -> Piezoelectric Direct Voltage (25kV) -> Dielectric Air Breakdown -> Multi-Segment Electric Arc Bolt + Audio Snap',
      designSignature: 'Typography: Bold Syne · Color: High-Voltage Tungsten Spark White & Cyan Corona · Composition: Dielectric Electrode Bench',
      description: 'Piezoelectric quartz crystal high-voltage spark gap igniter where mechanical hammer strikes generate a 25,000V electric potential arc jumping across letter electrodes.',
      keyTechnologies: ['Dielectric Breakdown Modeling', 'Lightning Jagged Arc Synthesis', 'Web Audio High-Voltage Transient'],
    },
    component: Experiment49PiezoelectricSparkGap,
  },
  {
    meta: {
      id: '050',
      number: '050',
      title: 'Astrophysical Cosmic Ray Muon Chamber',
      category: 'Simulation',
      tags: ['Cosmic Muons', 'Supernova Relics', 'Isopropanol Vapor', 'Cosmic Ray Archaeology'],
      mechanismSignature: 'Primary Supernova Muons (TeV) -> Relativistic Atmospheric Descent -> Chilled Isopropanol (-32°C) Ionization -> Luminous Condensation Tracks',
      designSignature: 'Typography: Syne Monumental Bold · Color: Relativistic Sky Blue Muon Trails on Cryogenic Black · Composition: Cryogenic Cloud Chamber',
      description: '50th Milestone Experiment: Astrophysical cosmic ray cloud chamber where relativistic muons from outer space streak through supersaturated vapor, illuminating Hello World.',
      keyTechnologies: ['Relativistic Particle Flux Modeling', 'Vapor Condensation Ionization', 'Deep Cosmic Trail Shaders'],
    },
    component: Experiment50CosmicRayCloudChamber,
  },
  {
    meta: {
      id: '051',
      number: '051',
      title: 'Photoelastic Birefringence Polarization',
      category: 'Retro & Optics',
      tags: ['Birefringence', 'Polarized Light', 'Stress Optics', 'Isochromatic Fringes'],
      mechanismSignature: 'Crossed Linear Polarizers -> Anisotropic Birefringent Crystal Delay -> Photoelastic Stress Fringes -> Chromatic Interference',
      designSignature: 'Typography: Syne Bold · Color: Isochromatic Multi-Spectral Rainbow Fringes · Composition: Polariscope Optical Stage',
      description: 'Photoelastic stress birefringence under crossed polarizers: mechanical stress forces within transparent polycarbonate crystal warp light rays into chromatic interference fringes.',
      keyTechnologies: ['Fresnel Wave Transmission Math', 'Stress Tensor Fringe Mapping', 'Crossed Polariscope Simulation'],
    },
    component: Experiment51BirefringencePolarizedLight,
  },
  {
    meta: {
      id: '052',
      number: '052',
      title: 'Mechanical Epicycloid Spirograph',
      category: 'Physics & Geometry',
      tags: ['Spirograph', 'Epicycloid', 'Hypotrochoid', 'Gears'],
      mechanismSignature: 'Fixed Stator Gear (R) -> Rolling Planet Cog (r) -> Pen Distance Hole (d) -> Parametric Epitrochoid Tracing',
      designSignature: 'Typography: Syne Sans · Color: Luminous Cyan, Gold & Magenta Guilloché · Composition: Precision Gear Assembly',
      description: 'Precision mechanical spirograph simulating interlocking gear cogs tracing intricate mathematical hypotrochoid and epicycloid curves around Hello World.',
      keyTechnologies: ['Parametric Epicycloid Math', 'Real-Time Gear Kinematics', 'Guilloché Curve Smoothing'],
    },
    component: Experiment52SpirographEpicycloid,
  },
  {
    meta: {
      id: '053',
      number: '053',
      title: 'Acoustic Ferrofluid Rosensweig Spikes',
      category: 'Audio & Signals',
      tags: ['Ferrofluid', 'Rosensweig Instability', 'Audio Reactive', 'Neodymium Magnet'],
      mechanismSignature: 'Web Audio Bass Frequency (Hz) -> Dynamic Solenoid Field (mT) -> Critical Surface Tension -> Rosensweig Hydrothermal Spikes',
      designSignature: 'Typography: Syne Bold · Color: Glossy Black Liquid Chrome Spikes & Blue Luminescence · Composition: Glass Ferrofluid Cell',
      description: 'Acoustic-driven ferrofluid cell: low-frequency audio waves modulate magnetic field lines, causing colloidal magnetite nanoparticles to form dynamic Rosensweig liquid spikes.',
      keyTechnologies: ['Rosensweig Instability Physics', 'Web Audio Tone Oscillator', 'Liquid Spike Normal Shading'],
    },
    component: Experiment53MagneticFerrofluidAudio,
  },
  {
    meta: {
      id: '054',
      number: '054',
      title: '3D Vector Oscilloscope Lissajous Figures',
      category: 'Audio & Signals',
      tags: ['Oscilloscope', 'Lissajous', 'Vector Beam', 'Harmonics'],
      mechanismSignature: 'Harmonic X-Y-Z Phase Signals (wx, wy, wz) -> Electrostatic Deflection Plates -> 3D Orthogonal Lissajous Knot',
      designSignature: 'Typography: Vector Monospace · Color: P31 High-Persistence Phosphor Cyan/Emerald · Composition: Cathode Ray Gun Viewport',
      description: 'Dual-channel harmonic signal vector oscilloscope plotting 3D Lissajous knot orbits in real-time with phosphor persistence decay.',
      keyTechnologies: ['Lissajous Harmonic Equations', 'Phosphor Persistence Attenuation', '3D Matrix Rotation'],
    },
    component: Experiment54OscilloscopeLissajous3D,
  },
  {
    meta: {
      id: '055',
      number: '055',
      title: 'Turing Morphogenetic Reaction-Diffusion',
      category: 'Simulation',
      tags: ['Alan Turing', 'Reaction-Diffusion', 'Gray-Scott', 'Morphogenesis'],
      mechanismSignature: 'Laplacian Spatial Diffusion (Du, Dv) -> Non-Linear Reaction (U*V^2) -> Feed (F) & Kill (k) -> Biological Turing Spots & Labyrinth Stripes',
      designSignature: 'Typography: Syne Typography · Color: High-Contrast Obsidian & Phosphor White Cells · Composition: Cellular Petri Dish',
      description: 'Reaction-diffusion system modeling natural pattern formation: activator and inhibitor chemical reactions spontaneous create spots, stripes, and labyrinth structures.',
      keyTechnologies: ['Gray-Scott Reaction PDEs', '5-Point Laplacian Stencil', 'Cellular Grid Evolution'],
    },
    component: Experiment55ReactionDiffusionTuring,
  },
  {
    meta: {
      id: '056',
      number: '056',
      title: 'High-Frequency Neon Plasma Globe Arc',
      category: 'Physics & Geometry',
      tags: ['Plasma Globe', 'Tesla Arc', 'Inert Gas', 'Capacitive Touch'],
      mechanismSignature: '35kHz RF Central Electrode -> Inert Noble Gas Ionization -> Capacitive Finger Coupling -> Filamentary Plasma Arcs',
      designSignature: 'Typography: Syne Sans · Color: Electric Magenta, Neon Blue & Violet Plasma Filaments · Composition: Borosilicate Glass Sphere',
      description: '1970 Bill Parker plasma globe: high-voltage radio-frequency oscillator ionizes noble gas mixture into writhing electric filaments attracted to user cursor touch.',
      keyTechnologies: ['Filamentary Dielectric Arcs', 'Capacitive Distance Vectoring', 'Noble Gas Color Rendering'],
    },
    component: Experiment56NeonPlasmaGlobeArc,
  },
  {
    meta: {
      id: '057',
      number: '057',
      title: 'Electromechanical Flip-Disc Matrix',
      category: 'Retro & Optics',
      tags: ['Flip-Disc', 'Dot Matrix', 'Ferrite Vane', 'Airport Display'],
      mechanismSignature: 'ASCII Character Matrix -> Solenoid Current Inversion -> Magnetic Flip of Bifacial Discs (Black/Yellow) -> Mechanical Clack Sound',
      designSignature: 'Typography: 5x7 Dot Matrix Bitmap · Color: High-Visibility Airport Yellow on Matte Black · Composition: Transit Departure Board',
      description: 'Classic airport departure board electromechanical flip-disc matrix with clicking bifacial vanes flipping between matte black and fluorescent yellow.',
      keyTechnologies: ['Bifacial Magnetic Vane State', 'Mechanical Click Synthesis', 'Bitmap Character Font Mapping'],
    },
    component: Experiment57FlipDiscMatrixVane,
  },
  {
    meta: {
      id: '058',
      number: '058',
      title: 'Moiré Optical Interference Grids',
      category: 'Retro & Optics',
      tags: ['Moiré', 'Spatial Frequency', 'Grid Interference', 'Optical Illusion'],
      mechanismSignature: 'Dual Periodic Line Rasters -> Angular Pitch Rotation (theta) -> Spatial Beat Frequency Aliasing -> Dynamic Moiré Fringe Waves',
      designSignature: 'Typography: Instrument Serif · Color: Monochrome Contrast Black & Silver Frost · Composition: Superimposed Transparency Plates',
      description: 'Superimposed high-frequency periodic grating grids rotating to create dynamic Moiré interference fringe patterns revealing hidden typographic contours.',
      keyTechnologies: ['Spatial Frequency Aliasing Math', 'Dual Grid Ray Marching', 'Dynamic Pitch Modulation'],
    },
    component: Experiment58MoireInterferencePatterns,
  },
  {
    meta: {
      id: '059',
      number: '059',
      title: 'Non-Newtonian Fluid Shear Thickening',
      category: 'Simulation',
      tags: ['Non-Newtonian', 'Oobleck', 'Shear Thickening', 'Rheology'],
      mechanismSignature: 'Shear Strain Rate (d_gamma/dt) -> Hydrodynamic Particle Jamming -> Viscosity Spike (mu -> inf) -> Solidification Phase Transition',
      designSignature: 'Typography: Syne Sans · Color: Cornstarch Chalk White on Dark Mineral Basin · Composition: Rheological Impact Stage',
      description: 'Rheological simulation of shear-thickening non-Newtonian fluid (oobleck): liquid behaves like water under slow motions but instantaneously solidifies into rigid impact craters.',
      keyTechnologies: ['Shear-Dependent Viscosity PDE', 'Particle Jamming Transition Math', 'Impulse Stress Dispersal'],
    },
    component: Experiment59NonNewtonianOobleckShear,
  },
  {
    meta: {
      id: '060',
      number: '060',
      title: 'Stroboscopic Water Droplet Levitation',
      category: 'Simulation',
      tags: ['Stroboscope', 'Water Droplets', 'Levitation', 'Aliasing'],
      mechanismSignature: 'Acoustic Nozzle Droplet Drip (Hz) -> Stroboscopic Flash Rate (Hz + delta) -> Temporal Aliasing -> Apparent Optical Levitation & Reversal',
      designSignature: 'Typography: Syne Sans · Color: Luminous Aqua Droplets on Obsidian Backdrop · Composition: Vertical Strobe Column',
      description: 'Temporal stroboscopic illusion: periodic water droplets illuminated by pulsed LED flashes appear to freeze in mid-air, levitate backwards, or crawl slowly downwards.',
      keyTechnologies: ['Temporal Aliasing Equations', 'Stroboscopic Duty Cycle Pulse', 'Droplet Trajectory Kinematics'],
    },
    component: Experiment60StroboscopicWaterLevitation,
  },
  {
    meta: {
      id: '061',
      number: '061',
      title: 'Dendritic Ice Crystal Solidification',
      category: 'Simulation',
      tags: ['Dendritic Growth', 'Diffusion Limited Aggregation', 'Frost Crystals', 'Freezing'],
      mechanismSignature: 'Supersaturated Vapor / Thermal Undercooling -> Anisotropic Surface Tension -> Mullins-Sekerka Instability -> Branching Hexagonal Frost Dendrites',
      designSignature: 'Typography: Instrument Serif · Color: Glacial Crystal Cyan & Diamond Frost Silver · Composition: Cryogenic Glass Substrate',
      description: 'Hexagonal dendritic crystallization modeling snowflake and frost formation: ice branches grow outward along crystal lattice axes, encapsulating Hello World.',
      keyTechnologies: ['Mullins-Sekerka Solidification', 'Hexagonal Lattice Growth Math', 'Dendrite Tip Curvature Tracking'],
    },
    component: Experiment61DendriticCrystalGrowth,
  },
  {
    meta: {
      id: '062',
      number: '062',
      title: 'Particle Collider Bubble Chamber Tracks',
      category: 'Simulation',
      tags: ['Bubble Chamber', 'Lorentz Force', 'Particle Physics', 'Curvature'],
      mechanismSignature: 'Charged Relativistic Particles (q) -> Uniform Magnetic Field B -> Lorentz Force F = q(v x B) -> Helical Vapor Bubble Trajectories + Decay Vertices',
      designSignature: 'Typography: Syne Sans · Color: Bubble Track White, Electron Green & Positron Violet · Composition: Cryogenic Hydrogen Chamber Plate',
      description: '1952 Donald Glaser bubble chamber: subatomic particle collision tracks in superheated liquid hydrogen spiraling under magnetic fields with radioactive decay vertices.',
      keyTechnologies: ['Lorentz Force Integration', 'Decay Kinematics Conservation', 'Vapor Bubble Cluster Rendering'],
    },
    component: Experiment62BubbleChamberMagneticDecay,
  },
  {
    meta: {
      id: '063',
      number: '063',
      title: 'Newton Rings Thin-Film Interference',
      category: 'Retro & Optics',
      tags: ['Newton Rings', 'Thin Film', 'Air Wedge', 'Optical Flat'],
      mechanismSignature: 'Convex Lens on Optical Flat -> Variable Air Wedge Gap (d = r^2/2R) -> Optical Path Difference 2d + lambda/2 -> Concentric Chromatic Interference Rings',
      designSignature: 'Typography: Syne Sans · Color: Concentric Spectral Rainbow Rings & Sapphire Center · Composition: Precision Optical Testing Bench',
      description: 'Sir Isaac Newton 1704 optical interference phenomenon: monochromatic and white light reflecting between a convex lens and optical flat creating concentric interference rings.',
      keyTechnologies: ['Thin-Film Path Difference Math', 'Spectral Wavelength Phase Shifts', 'Radial Circular Grating Shader'],
    },
    component: Experiment63NewtonRingsInterference,
  },
  {
    meta: {
      id: '064',
      number: '064',
      title: 'Bak-Tang-Wiesenfeld Abelian Sandpile',
      category: 'Simulation',
      tags: ['Self-Organized Criticality', 'Sandpile', 'Power Law', 'Avalanche'],
      mechanismSignature: 'Cellular Grain Deposition -> Critical Slope Threshold (z >= 4) -> Toppling Cascade Avalanche -> Power-Law 1/f Fractal Lattice',
      designSignature: 'Typography: Monospace Matrix · Color: 4-State Color Ramp: Obsidian, Amber, Coral, White · Composition: Self-Organized Cellular Grid',
      description: '1987 Bak-Tang-Wiesenfeld sandpile model of Self-Organized Criticality: grains accumulate until crossing critical thresholds, triggering power-law avalanche cascades.',
      keyTechnologies: ['Abelian Sandpile Cellular Automaton', 'Avalanche Size Power-Law Tracking', 'Multi-Scale Grain Toppling'],
    },
    component: Experiment64SandpileSelfOrganizedCriticality,
  },
  {
    meta: {
      id: '065',
      number: '065',
      title: '1804 Jacquard Loom Punched Card Weave',
      category: 'Typography',
      tags: ['Jacquard Loom', 'Punched Cards', 'Textile Weave', 'Pre-Computing'],
      mechanismSignature: 'Binary Punched Cards (Holes/Blanks) -> Mechanical Needle Feeler Selection -> Warp Yarn Shedding -> Damask Silk Brocade Weave',
      designSignature: 'Typography: Woven Silk Texture · Color: Crimson Silk Warp & Pure Gold Metallic Weft · Composition: 19th Century Textile Weaving Frame',
      description: '1804 Joseph Marie Jacquard automated punched card loom: the foundational ancestor of modern computing weaving Hello World into intricate damask silk fabric.',
      keyTechnologies: ['Punched Card Binary Reader', 'Warp & Weft Interlacing Logic', 'Damask Fabric Texture Simulation'],
    },
    component: Experiment65MechanicalJacquardLoom,
  },
  {
    meta: {
      id: '066',
      number: '066',
      title: 'Doppler Radar Wind Velocity Profiler',
      category: 'Audio & Signals',
      tags: ['Doppler Radar', 'Wind Velocity', 'Meteorology', 'Base Reflectivity'],
      mechanismSignature: 'Microwave Pulse Emission -> Hydro-Meteor Backscatter -> Doppler Frequency Shift delta_f = 2v/lambda -> Radial Velocity Field Vector Map',
      designSignature: 'Typography: Syne Bold · Color: NEXRAD Velocity Spectrum: Cool Cyan Inbound / Warm Scarlet Outbound · Composition: Meteorological PPI Display',
      description: 'NEXRAD Doppler weather radar velocity profiler calculating atmospheric wind velocity vectors via phase shifts to map cyclonic circulation around Hello World.',
      keyTechnologies: ['Doppler Frequency Shift Math', 'NEXRAD Color Look-Up Table', 'Radial Velocity Vector Field'],
    },
    component: Experiment66DopplerRadarWindVelocity,
  },
  {
    meta: {
      id: '067',
      number: '067',
      title: 'Fiber Optic Total Internal Reflection',
      category: 'Physics & Geometry',
      tags: ['Fiber Optics', 'Total Internal Reflection', 'Snell Law', 'Photon Waveguide'],
      mechanismSignature: 'Core Refractive Index n1 > Cladding n2 -> Angle > Critical Angle theta_c = arcsin(n2/n1) -> Total Internal Reflection -> Lossless Laser Propagation',
      designSignature: 'Typography: Syne Sans · Color: 1550nm Telecom Infrared & Glowing Neon Laser Core · Composition: Curled Glass Fiber Waveguide',
      description: 'Total Internal Reflection inside ultra-pure silica glass fiber optics: optical waveguides bouncing photons along curved glass pathways without transmission loss.',
      keyTechnologies: ['Snell Critical Angle Equation', 'Fresnel Waveguide Reflection Tracking', 'Optical Core Emission Rendering'],
    },
    component: Experiment67FiberOpticTotalInternalReflection,
  },
  {
    meta: {
      id: '068',
      number: '068',
      title: 'Ultrasonic Acoustic Levitation Chamber',
      category: 'Physics & Geometry',
      tags: ['Acoustic Levitation', 'Standing Wave', 'Ultrasonic Transducer', 'Gor’kov Potential'],
      mechanismSignature: '40kHz Piezo Transducers -> Acoustic Standing Wave -> Pressure Nodes & Gor’kov Radiation Force -> Polystyrene Particle Mid-Air Levitation',
      designSignature: 'Typography: Syne Sans · Color: Ultrasonic Wavefront Emerald Glow & Floating Pearlescent Beads · Composition: Phased Array Chamber',
      description: '40kHz ultrasonic acoustic levitator: opposing ultrasonic transducers create standing acoustic wave pressure nodes trapping particles in mid-air above the letterforms.',
      keyTechnologies: ['Gor’kov Potential Acoustic Force', 'Standing Wave Pressure Mapping', 'Particle Micro-Buoyancy Kinematics'],
    },
    component: Experiment68AcousticLevitationNodes,
  },
  {
    meta: {
      id: '069',
      number: '069',
      title: 'Ebru & Suminagashi Fluid Paper Marbling',
      category: 'Typography',
      tags: ['Ebru Marbling', 'Suminagashi', 'Surface Tension', 'Fluid Dynamics'],
      mechanismSignature: 'Ox-Gall Treated Mineral Pigments -> Viscous Carrageenan Water Surface -> Comb/Stylus Distortion -> Swirling Concentric Drop Patterns',
      designSignature: 'Typography: Instrument Serif · Color: Mineral Indigo, Terracotta & Gold Leaf Swirls · Composition: Hand-Marbled Washi Paper Sheet',
      description: 'Ancient Turkish Ebru and Japanese Suminagashi water marbling art: floating pigment drops combed into hypnotic fluid marbling waves framing Hello World.',
      keyTechnologies: ['Surface Tension Fluid Advection', 'Combing Deformation Vectors', 'Organic Pigment Layer Dispersion'],
    },
    component: Experiment69FluidMarblingEbruSuminagashi,
  },
  {
    meta: {
      id: '070',
      number: '070',
      title: 'Solar Fraunhofer Spectral Absorption Lines',
      category: 'Retro & Optics',
      tags: ['Fraunhofer Lines', 'Solar Spectrum', 'Absorption Spectroscopy', 'Astrophysics'],
      mechanismSignature: 'Solar Photosphere Continuous Blackbody -> Chromospheric Atomic Gas Absorption -> Dark Fraunhofer Lines (H-alpha, Na-D, Ca-K) -> Elemental Fingerprint',
      designSignature: 'Typography: Monospace Data · Color: Full High-Resolution Solar Rainbow Spectrum (380-750nm) · Composition: High-Dispersion Spectrogram Plate',
      description: '1814 Joseph von Fraunhofer solar absorption spectrograph: continuous solar white light punctuated by dark atomic absorption lines revealing the composition of the universe.',
      keyTechnologies: ['Continuous Planck Blackbody Dispersion', 'Atomic Absorption Transition Wavelengths', 'High-Resolution Spectral Slit View'],
    },
    component: Experiment70SolarSpectrographFraunhofer,
  },
  {
    meta: {
      id: '071',
      number: '071',
      title: 'Nematic Liquid Crystal Schlieren Texture',
      category: 'Simulation',
      tags: ['Liquid Crystal', 'Schlieren', 'Nematic Phase', 'Topological Defects'],
      mechanismSignature: 'Anisotropic Nematic Director Field -> Frank Free Energy Minimization -> Topological Disclination Defects (+-1/2) -> Schlieren Optical Textures',
      designSignature: 'Typography: Syne Sans · Color: Crossed Polarizer Optical Iridescence & Amber Disclination Brushes · Composition: Polarizing Microscope Stage',
      description: 'Nematic liquid crystal Schlieren texture under polarizing microscopy: fluid molecular orientation director fields forming topological disclination defect lines.',
      keyTechnologies: ['Frank-Oseen Free Energy Math', 'Director Field Topological Defects', 'Birefringent Schlieren Texture Shader'],
    },
    component: Experiment71LiquidCrystalSchlierenTexture,
  },
  {
    meta: {
      id: '072',
      number: '072',
      title: 'Penrose Aperiodic 5-Fold Rhombic Tiling',
      category: 'Physics & Geometry',
      tags: ['Penrose Tiling', 'Aperiodic', 'Golden Ratio', 'Quasicrystals'],
      mechanismSignature: 'Thick & Thin Golden Rhombi -> Aperiodic Matching Rules -> 5-Fold Radial Symmetry -> Infinite Non-Repeating Quasicrystal Tiling',
      designSignature: 'Typography: Instrument Serif · Color: Royal Blue, Amber Gold & Pure White Rhombi · Composition: Infinite Geometric Mosaic Slate',
      description: 'Sir Roger Penrose 1974 aperiodic tiling: golden ratio rhombi tiling the plane with 5-fold rotational symmetry without translational periodicity.',
      keyTechnologies: ['Golden Ratio Phi Inflation/Deflation', 'Aperiodic Rhombus Matching Rules', '5-Fold Radial Geometric Projection'],
    },
    component: Experiment72PenroseAperiodicTiling,
  },
  {
    meta: {
      id: '073',
      number: '073',
      title: 'General Relativistic Gravitational Lensing',
      category: 'Physics & Geometry',
      tags: ['Gravitational Lens', 'General Relativity', 'Einstein Ring', 'Black Hole'],
      mechanismSignature: 'Schwarzschild Metric Geodesic Deflection -> Impact Parameter Bending -> Einstein Ring Arc Distortion -> Relativistic Accretion Glow',
      designSignature: 'Typography: Syne Bold · Color: Luminous Orange Doppler Beaming & Deep Space Void · Composition: Gravitational Field Viewport',
      description: 'Einstein General Relativity gravitational lensing: massive black hole warps background light rays of Hello World into brilliant Einstein rings and luminous arcs.',
      keyTechnologies: ['Geodesic Light Ray Bending Math', 'Einstein Radius Calculation', 'Relativistic Doppler Beaming'],
    },
    component: Experiment73GravitationalLensingBlackHole,
  },
  {
    meta: {
      id: '074',
      number: '074',
      title: 'Equilateral Kaleidoscope Mirror Prism',
      category: 'Retro & Optics',
      tags: ['Kaleidoscope', 'Mirror Symmetry', 'Optical Reflections', 'Mandala'],
      mechanismSignature: '60° Equilateral Triangle Mirrors -> Planar Double Reflections -> N-Fold Radial Symmetry Folding -> Dynamic Vitreous Shard Mandala',
      designSignature: 'Typography: Instrument Serif · Color: Jewel Sapphire, Amber Gold & Ruby Shards · Composition: Brass Telescopic Aperture',
      description: 'Sir David Brewster 1816 kaleidoscope: 60-degree angled optical mirrors multiplying fragments of Hello World into hypnotic radial kaleidoscopic mandalas.',
      keyTechnologies: ['Planar Mirror Reflection Matrix', 'Radial Angular Slices', 'Dynamic Glass Shard Kinematics'],
    },
    component: Experiment74KaleidoscopeHexagonalMirror,
  },
  {
    meta: {
      id: '075',
      number: '075',
      title: 'Braitenberg Autonomous Cybernetic Vehicles',
      category: 'Simulation',
      tags: ['Braitenberg Vehicles', 'Synthetic Psychology', 'Phototaxis', 'Robotics'],
      mechanismSignature: 'Dual Photoreceptor Sensors -> Crossed / Uncrossed Motor Connections -> Differential Steering Kinematics -> Phototactic Navigation Toward Beacons',
      designSignature: 'Typography: Syne Sans Beacons · Color: Luminous Light Beacons & Multi-Color Vehicle Trails · Composition: Cybernetic Arena Floor',
      description: 'Valentino Braitenberg synthetic psychology vehicles: autonomous differential-drive agents navigating toward glowing Hello World letter beacons with complex behaviors.',
      keyTechnologies: ['Differential Steering Kinematics', 'Phototactic Inverse-Square Sensor Math', 'Vehicle Behavioral Wiring Models'],
    },
    component: Experiment75BraitenbergVehicleSensor,
  },
  {
    meta: {
      id: '076',
      number: '076',
      title: 'Mu-Metal High-Permeability Magnetic Shield',
      category: 'Physics & Geometry',
      tags: ['Mu-Metal', 'Magnetic Shielding', 'Permeability', 'Superconducting Cavity'],
      mechanismSignature: 'Ferromagnetic Mu-Metal Shell (mu_r = 80,000) -> Magnetic Flux Shunting -> Internal Cavity Attenuation -> Zero-Field Superconducting Isolation',
      designSignature: 'Typography: Syne Bold · Color: Slate Gray Shell & Frost White Protected Specimen · Composition: High-Vacuum Shielding Bench',
      description: 'High-permeability 80% nickel-iron mu-metal magnetic shield shunting external magnetic flux field lines away from an ultra-sensitive isolated core.',
      keyTechnologies: ['Magnetic Shielding Attenuation Math', 'Cylindrical Flux Bending Vector Field', 'Cryogenic Isolation Display'],
    },
    component: Experiment76MuMetalMagneticShielding,
  },
  {
    meta: {
      id: '077',
      number: '077',
      title: '4D Hopf Fibration Torus Knot Projection',
      category: 'Physics & Geometry',
      tags: ['Hopf Fibration', '4D Geometry', 'Torus Knot', 'Stereographic Projection'],
      mechanismSignature: '4D Hypersphere S3 -> Hopf Fibration Map (p, q) -> Stereographic Projection to R3 -> Nested Interlocking Torus Fiber Bundles',
      designSignature: 'Typography: Instrument Serif · Color: Multi-Spectral Iridescent Spectral Fibers on Obsidian · Composition: 4D Phase Space Manifold',
      description: 'Stereographic projection of the 4D Hopf fibration: interlocking circles on 3-sphere nested onto 3D tori winding around the letterforms of Hello World.',
      keyTechnologies: ['4D Stereographic Projection Math', 'Torus Knot Parametric Equations', 'Nested Fiber Bundle Rendering'],
    },
    component: Experiment77HopfFibrationTorusKnot,
  },
  {
    meta: {
      id: '078',
      number: '078',
      title: 'Long-Wave Infrared Thermography (LWIR)',
      category: 'Retro & Optics',
      tags: ['Thermal Imaging', 'FLIR', 'Bolometer', 'Infrared LUT'],
      mechanismSignature: 'Blackbody Radiance (Stefan-Boltzmann) -> Microbolometer Pixel Resistance Shift -> FLIR False-Color Gradient LUT -> Thermal Diffusion Field',
      designSignature: 'Typography: Syne Sans · Color: FLIR Ironbow, Arctic & White-Hot Palettes · Composition: Thermal Camera Sensor Reticle',
      description: 'Long-wave infrared (8-14um) thermal imaging false-color radiation map visualizing heat dissipation and conduction isotherms across brass letterforms.',
      keyTechnologies: ['FLIR Color Look-Up Table Shaders', 'Radiant Heat Diffusion Math', 'Spot Temperature Meter Integration'],
    },
    component: Experiment78ThermographicThermalImaging,
  },
  {
    meta: {
      id: '079',
      number: '079',
      title: 'Strontium Aluminate Phosphorescent Glow Wall',
      category: 'Retro & Optics',
      tags: ['Phosphorescence', 'Persistent Luminescence', 'UV Laser', 'Electron Traps'],
      mechanismSignature: '395nm UV Photon Absorption -> Eu2+/Dy3+ Metastable Electron Traps -> Thermally Stimulated Recombination -> Exponential Phosphorescence Decay',
      designSignature: 'Typography: Syne Bold · Color: Radiant Emerald Green Phosphor Afterglow on Charcoal · Composition: Darkroom Excitation Wall',
      description: 'Strontium aluminate persistent luminescence wall: user UV laser pointer charges metastable electron traps that slowly release brilliant emerald afterglow.',
      keyTechnologies: ['Trapped Electron Decay Kinetics', 'Spatial Grid Excitation Accumulation', 'Interactive UV Pointer Canvas'],
    },
    component: Experiment79PhosphorescentGlowWall,
  },
  {
    meta: {
      id: '080',
      number: '080',
      title: 'Edward Lorenz Chaotic Strange Attractor',
      category: 'Simulation',
      tags: ['Lorenz Attractor', 'Chaos Theory', 'Nonlinear Dynamics', 'Butterfly Effect'],
      mechanismSignature: 'Coupled 3D ODE System (dx/dt=sigma(y-x), dy/dt=x(rho-z)-y, dz/dt=xy-beta*z) -> Runge-Kutta Integration -> Dual-Lobe Chaotic Butterfly Orbit',
      designSignature: 'Typography: Syne Sans · Color: Electric Sky Blue & Carmine Particle Core on Dark Slate · Composition: 3D Phase Space Manifold',
      description: '1963 Edward Lorenz atmospheric convection equations: deterministic chaos where orbital trajectories orbit between dual butterfly lobes without ever intersecting.',
      keyTechnologies: ['Lorenz Differential Equation Solver', '3D Trajectory Projection', 'Phase Space Orbital Flow'],
    },
    component: Experiment80LorenzStrangeAttractor,
  },
  {
    meta: {
      id: '081',
      number: '081',
      title: '1968 IN-14 Cold-Cathode Nixie Discharge Tubes',
      category: 'Retro & Optics',
      tags: ['Nixie Tube', 'Cold Cathode', 'Neon Glow', 'Vintage Electronics'],
      mechanismSignature: '170V DC Anode Potential -> Penning Gas Mixture Ionization (Ne-Ar) -> Negative Glow Discharge Sheath -> Stacked Wire Cathode Illumination',
      designSignature: 'Typography: Monospace Bent Wire · Color: 585nm Neon Orange & Blue Mercury Trace · Composition: Bakelite & Glass Tube Chassis',
      description: 'Soviet IN-14 cold-cathode Nixie tubes: high-voltage neon gas discharge illuminating delicate bent wire cathode characters inside glass envelopes.',
      keyTechnologies: ['Penning Mixture Gas Discharge Model', 'High-Voltage Anode Voltage Scaling', 'Wire Cathode Silhouette Rendering'],
    },
    component: Experiment81NixieTubeGasDischarge,
  },
  {
    meta: {
      id: '082',
      number: '082',
      title: 'Chladni Acoustic Sand Voice Harmonics',
      category: 'Audio & Signals',
      tags: ['Chladni Plate', 'Cymatics', 'Audio Synthesis', 'Nodal Lines'],
      mechanismSignature: 'Web Audio Sine Oscillator (Hz) -> Orthogonal Plate Vibration Modes (m, n) -> Zero-Displacement Nodal Lines -> Fine Sand Accumulation',
      designSignature: 'Typography: Syne Sans · Color: Golden Silica Sand Grains on Brushed Steel Plate · Composition: Resonant Square Plate Stage',
      description: 'Ernst Chladni 1787 cymatic acoustic plate driven by real-time Web Audio tones: vibrating steel drives sand grains toward geometric nodal lines.',
      keyTechnologies: ['Chladni Nodal Surface Mathematics', 'Web Audio Sine Tone Synthesizer', 'Stochastic Nodal Sand Accumulation'],
    },
    component: Experiment82ChladniSandVoiceHarmonics,
  },
  {
    meta: {
      id: '083',
      number: '083',
      title: 'Kinetic Triton Cyclonic Whirlwind',
      category: 'Simulation',
      tags: ['Whirlwind', 'Rankine Vortex', 'Updraft', 'Dust Particles'],
      mechanismSignature: 'Atmospheric Angular Momentum Conservation -> Rankine Vortex Velocity Profile -> Vertical Updraft Pressure Drop -> Cyclonic Dust Funnel',
      designSignature: 'Typography: Syne Sans · Color: Amber Dust Particles & Luminous Eye of the Storm · Composition: Cyclonic Atmospheric Column',
      description: 'Rankine atmospheric fluid vortex particle simulation: high-speed cyclonic updraft winds lift dust particles into a funnel framing the eye of the storm.',
      keyTechnologies: ['Rankine Vortex Velocity Math', 'Helical Updraft Kinematics', 'Dust Particle Swarm Integration'],
    },
    component: Experiment83KineticWindTritonWhirlwind,
  },
  {
    meta: {
      id: '084',
      number: '084',
      title: '1991 Single-Image Random-Dot Stereogram (SIRDS)',
      category: 'Retro & Optics',
      tags: ['Autostereogram', 'Magic Eye', 'SIRDS', 'Binocular Disparity'],
      mechanismSignature: '3D Typographic Depth Map -> Horizontal Disparity Shift (delta_x = D * z) -> Pixel Link Constraints -> Autostereoscopic Volumetric Pop-Out',
      designSignature: 'Typography: Extruded Depth Contour · Color: High-Frequency Cyan & Gold Random Dot Field · Composition: Autostereoscopic Wall',
      description: '1990s Magic Eye autostereogram: single-image random dot field encoding hidden 3D volumetric extrusion of Hello World via binocular eye divergence.',
      keyTechnologies: ['SIRDS Constraint Propagation Algorithm', 'Depth Map Disparity Calculation', 'Stereoscopic Fusion Guidance'],
    },
    component: Experiment84StereogramMagicEye3D,
  },
  {
    meta: {
      id: '085',
      number: '085',
      title: '1948 Curt Herzstark Curta Type II Calculator',
      category: 'Retro & Optics',
      tags: ['Curta Calculator', 'Stepped Drum', 'Mechanical Computing', 'Tens Carry'],
      mechanismSignature: 'Hand Crank 360° Rotation -> Stepped Gear Drum Cam Transmission -> Tens-Carry Complement Multiplication -> Mechanical Output Register',
      designSignature: 'Typography: Mechanical Digits · Color: Precision Matte Black Steel, Knurled Grip & Brass Accents · Composition: Peppercorn Calculator Cylinder',
      description: 'Curt Herzstark 1948 pocket mechanical calculator: intricate stepped drum gears, sliding dials, and carry levers calculating ASCII character sums.',
      keyTechnologies: ['Stepped Gear Drum Kinematics', 'Complement Arithmetic Logic', 'Mechanical Register Emulation'],
    },
    component: Experiment85MechanicalCurtaCalculator,
  },
  {
    meta: {
      id: '086',
      number: '086',
      title: 'Alan Turing Biomorph Morphogenesis',
      category: 'Simulation',
      tags: ['Alan Turing', 'Morphogenesis', 'Biological Patterns', 'Reaction-Diffusion'],
      mechanismSignature: 'Chemical Activator-Inhibitor Interaction -> Diffusion Rate Instability -> Morphogen Threshold Filtering -> Biological Zebra / Leopard Skin Formation',
      designSignature: 'Typography: Stenciled Syne · Color: Zebra Monochrome & Leopard Golden Ocelli · Composition: Biomorphic Skin Membrane',
      description: 'Alan Turing 1952 Chemical Basis of Morphogenesis: spontaneous symmetry breaking in chemical morphogens giving rise to biological skin pigment patterns.',
      keyTechnologies: ['Turing Morphogenesis PDEs', 'Skin Pattern Thresholding', 'Multi-Scale Activator Wave Simulation'],
    },
    component: Experiment86TuringPatternBiomorphMorphogenesis,
  },
  {
    meta: {
      id: '087',
      number: '087',
      title: 'Hand-Drawn Graphite Carbon Pencil Circuit',
      category: 'Physics & Geometry',
      tags: ['Graphite Circuit', 'Ohm Law', 'Carbon Conductivity', 'SMD LED'],
      mechanismSignature: 'Graphite Crystal Cleavage on Paper -> Carbon Percolation Conduction -> Ohmic Resistance (R = rho * L / A) -> Surface Mount LED Illumination',
      designSignature: 'Typography: Syne Sans Heavy · Color: Sheen Graphite Carbon on Rag Paper & Glowing Gold LEDs · Composition: Electronic Drafting Board',
      description: 'Conductive carbon graphite circuits hand-drawn on cotton paper: resistance varies with line thickness and distance, powering illuminated SMD LEDs.',
      keyTechnologies: ['Ohmic Carbon Sheet Resistance', 'Percolation Conductivity Model', 'Multimeter Electrical HUD'],
    },
    component: Experiment87PencilLeadGraphiteCircuit,
  },
  {
    meta: {
      id: '088',
      number: '088',
      title: 'Anamorphic 3D Sculpture Shadow Projection',
      category: 'Retro & Optics',
      tags: ['Anamorphic Shadow', 'Fukuda Sculpture', 'Perspective Projection', 'Point Light'],
      mechanismSignature: 'Abstract 3D Spatial Wire Sculpture -> Precise Point-Source Ray Casting -> Wall Coordinate Intersection -> Legible Hello World Shadow Coherence',
      designSignature: 'Typography: Syne Sans Shadow · Color: High-Contrast Gallery Shadow on Warm Off-White Wall · Composition: Kinetic Gallery Installation',
      description: 'Shigeo Fukuda inspired 3D anamorphic shadow sculpture: an abstract wire assemblage in space that resolves into a crisp, legible shadow only at calibrated light angles.',
      keyTechnologies: ['Ray-Cast Shadow Perspective Projection', 'Anamorphic Coherence Metric', '3D Spatial Coordinate Transform'],
    },
    component: Experiment88AnamorphicShadowProjection,
  },
  {
    meta: {
      id: '089',
      number: '089',
      title: 'Faraday Electromagnetic Induction Solenoid',
      category: 'Physics & Geometry',
      tags: ['Faraday Law', 'Induction', 'Lenz Law', 'Galvanometer'],
      mechanismSignature: 'Moving Permanent Magnet -> Solenoid Flux Derivative dPhi/dt -> Faraday Induced EMF (-N * dPhi/dt) -> Analog Galvanometer Needle Deflection',
      designSignature: 'Typography: Syne Sans · Color: Copper Wound Solenoid & Center-Zero Galvanometer Voltmeter · Composition: Electromagnetic Test Bench',
      description: 'Michael Faraday 1831 electromagnetic induction: moving a neodymium magnet through a multi-turn copper solenoid generates voltage deflecting a galvanometer needle.',
      keyTechnologies: ['Faraday Flux Integration Math', 'Lenz Law Induced Current Dynamics', 'Analog Meter Mechanical Damping'],
    },
    component: Experiment89ElectromagneticInductionLoop,
  },
  {
    meta: {
      id: '090',
      number: '090',
      title: 'Vitreous Enamel Cloisonné Filigree',
      category: 'Typography',
      tags: ['Cloisonné', 'Vitreous Enamel', 'Gold Filigree', 'Kiln Glaze'],
      mechanismSignature: 'Delicate Metal Wire Ribbon Bending -> Fine Cell Enclosures (Cloisons) -> Crushed Glass Enamel Powder Infusion -> 850°C Kiln Vitrification',
      designSignature: 'Typography: Instrument Serif Filigree · Color: Pure Gold Cloisons, Cobalt Glass & Imperial Ruby Glaze · Composition: Medieval Gilded Plaque',
      description: 'Ancient Byzantine cloisonné decorative metalwork: delicate gold filigree wire bent into letter enclosures filled with vitreous crushed glass glaze and fired at 850°C.',
      keyTechnologies: ['Filigree Metal Wire Stroke Shaders', 'Vitreous Enamel Glaze Depth', 'Kiln High-Temperature Transformation'],
    },
    component: Experiment90VitreousEnamelCloisonne,
  },
  {
    meta: {
      id: '091',
      number: '091',
      title: 'YBCO Superconducting Meissner Levitation',
      category: 'Physics & Geometry',
      tags: ['Superconductivity', 'Meissner Effect', 'Quantum Pinning', 'Liquid Nitrogen'],
      mechanismSignature: 'Liquid Nitrogen (77K) Cooling -> YBCO Phase Transition (T < Tc) -> Complete Magnetic Flux Expulsion -> Quantum Flux Pinning Mid-Air Levitation',
      designSignature: 'Typography: Syne Bold · Color: Superconducting Ice Blue, Cryogenic Vapor & Magnetic Track Poles · Composition: Cryogenic Rail Stage',
      description: 'High-temperature YBCO ceramic superconductor cooled in liquid nitrogen (77K): complete Meissner flux expulsion causes frictionless quantum levitation above magnetic tracks.',
      keyTechnologies: ['Meissner Flux Expulsion Math', 'Quantum Pinning Restoring Force', 'Cryogenic Phase State Modeling'],
    },
    component: Experiment91SuperconductingMeissnerLevitation,
  },
  {
    meta: {
      id: '092',
      number: '092',
      title: 'Antoni Gaudí Funicular Catenary Arch',
      category: 'Physics & Geometry',
      tags: ['Catenary Arch', 'Antoni Gaudi', 'Funicular Model', 'Compression Vault'],
      mechanismSignature: 'Gravity Suspended Chains -> Pure Tensile Catenary Curve y = a*cosh(x/a) -> Vertical Geometric Inversion -> Pure Compression Masonry Arch Vault',
      designSignature: 'Typography: Instrument Serif · Color: Architectural Prussian Blue Blueprint & Ochre Stone Vaults · Composition: Structural Engineering Board',
      description: 'Antoni Gaudí funicular hanging chain architectural models: flexible chains under gravity tension inverted upside down to create pure-compression stone masonry vaults.',
      keyTechnologies: ['Hyperbolic Cosine Catenary Equation', 'Funicular Vector Inversion Logic', 'Masonry Arch Compression Mechanics'],
    },
    component: Experiment92CatenaryChainArchArchitectural,
  },
  {
    meta: {
      id: '093',
      number: '093',
      title: 'Georg Lichtenberg 1777 Dielectric Breakdown Fractal',
      category: 'Physics & Geometry',
      tags: ['Lichtenberg Figure', 'Dielectric Breakdown', 'High Voltage', 'Electron Discharge'],
      mechanismSignature: 'Relativistic Electron Beam Trapping -> High Negative Space Charge Density -> Point Ground Spike Trigger -> Tree-Like Dielectric Discharge Breakdown',
      designSignature: 'Typography: Syne Heavy · Color: Electric Ice Blue High-Voltage Lightning in Clear Acrylic · Composition: Dielectric Block Specimen',
      description: 'Georg Christoph Lichtenberg 1777 high-voltage dielectric breakdown: millions of volts of trapped electrons discharge through acrylic in intricate branching fractals.',
      keyTechnologies: ['Dielectric Breakdown Diffusion-Limited Aggregation', 'High-Voltage Plasma Glow Bloom', 'Stochastic Branching Streamers'],
    },
    component: Experiment93LichtenbergHighVoltageFractal,
  },
  {
    meta: {
      id: '094',
      number: '094',
      title: 'Multibeam Hydroacoustic Sonar Bathymetry',
      category: 'Audio & Signals',
      tags: ['Sonar Bathymetry', 'Doppler Chirp', 'Multibeam', 'Ocean Trench'],
      mechanismSignature: 'Hydroacoustic Acoustic Chirp (120kHz) -> Seabed Reflection Time-of-Flight -> Multibeam Fan Depth Mapping -> Topographic Ridge Contours',
      designSignature: 'Typography: Syne Sans · Color: Abyssal Deep Ocean Blue & Cyan Sonar Swath Sweep · Composition: Hydrographic Vessel PPI Console',
      description: 'Multibeam hydroacoustic sonar mapping ocean seafloor bathymetry: acoustic pings calculate depth time-of-flight to reveal submerged typographic mountain ridges.',
      keyTechnologies: ['Acoustic Time-of-Flight Mapping', 'Web Audio Sonar Chirp Synthesizer', 'Bathymetric Elevation Color Ramp'],
    },
    component: Experiment94SonarDopplerBathymetry,
  },
  {
    meta: {
      id: '095',
      number: '095',
      title: '1842 Sir John Herschel Cyanotype Sunprint',
      category: 'Retro & Optics',
      tags: ['Cyanotype', 'Photogram', 'Prussian Blue', 'Solar Exposure'],
      mechanismSignature: 'UV Solar Radiation Absorption -> Reduction of Fe(III) to Fe(II) -> Water Wash Oxidation -> Insoluble Prussian Blue Fe4[Fe(CN)6]3 Pigment',
      designSignature: 'Typography: Instrument Serif · Color: Rich Prussian Blue Emulsion & Pure White Botanical Silhouette · Composition: Cotton Rag Sunprint Sheet',
      description: '1842 Sir John Herschel cyanotype sunlight photogram: sunlight transforms iron salts into indelible Prussian blue, leaving botanical silhouettes around Hello World.',
      keyTechnologies: ['Photochemical UV Exposure Curve', 'Water Wash Oxidation Tone Shift', 'Cotton Rag Paper Texture Shading'],
    },
    component: Experiment95CyanotypeSunprintPhotogram,
  },
  {
    meta: {
      id: '096',
      number: '096',
      title: 'Musical Solid-State Tesla Coil (DRSSTC)',
      category: 'Audio & Signals',
      tags: ['Tesla Coil', 'DRSSTC', 'Musical Sparks', 'Audio Modulation'],
      mechanismSignature: 'Dual Resonant Primary Tank -> High-Q Secondary Voltage Step-Up -> Microcontroller Audio Pulse Train -> Resonant Polyphonic Plasma Arc Sparks',
      designSignature: 'Typography: Syne Heavy Electrodes · Color: Electric Ultraviolet & Magenta Plasma Streamers · Composition: High-Voltage Resonance Chamber',
      description: 'Dual-resonant musical solid-state Tesla coil (DRSSTC): audio frequencies modulate high-voltage spark discharges to play audible music through electric plasma arcs.',
      keyTechnologies: ['Resonant High-Voltage Spark Synthesis', 'Web Audio Pulse Modulator', 'Multi-Streamer Dielectric Breakdown'],
    },
    component: Experiment96ResonantTeslaCoilDischarge,
  },
  {
    meta: {
      id: '097',
      number: '097',
      title: 'PDMS Microfluidic Lab-On-A-Chip',
      category: 'Simulation',
      tags: ['Microfluidics', 'Lab-on-a-Chip', 'Laminar Flow', 'Fluorescence'],
      mechanismSignature: 'Syringe Pump Micro-Flow -> Low Reynolds Number Laminar Regimes (Re << 1) -> Droplet Micro-Pinchoff -> Fluorescein / Rhodamine UV Sorting',
      designSignature: 'Typography: Syne Outline Channels · Color: Neon Fluorescein Lime & Rhodamine Magenta on Silicon · Composition: Microfluidic Elastomer Wafer',
      description: 'Molded PDMS microfluidic lab-on-a-chip: laminar capillary fluid streams pump micro-droplets of fluorescing biochemical dyes through serpentine channels.',
      keyTechnologies: ['Low Reynolds Number Flow Physics', 'Droplet Generation Kinematics', 'Fluorescent Dye Optical Shading'],
    },
    component: Experiment97MicrofluidicLabOnAChip,
  },
  {
    meta: {
      id: '098',
      number: '098',
      title: 'Seismological Earthquake P & S Wave Ribbon',
      category: 'Simulation',
      tags: ['Seismology', 'Earthquake Waves', 'Richter Scale', 'Seismogram'],
      mechanismSignature: 'Tectonic Fault Rupture -> Primary Compressional P-Waves -> Secondary Shear S-Waves -> Rotating Drum Stylus Seismogram Traces',
      designSignature: 'Typography: Syne Heavy Watermark · Color: Carmine, Sky Blue & Amber 3-Axis Waveform Ribbons on Smoked Paper · Composition: Smoked Drum Seismogram',
      description: 'Global network seismograph drum recording earthquake wave arrivals: high-frequency primary P-waves and massive shear S-waves graphing Richter energy ribbons.',
      keyTechnologies: ['P & S Wave Propagation Mechanics', 'Richter Exponential Amplitude Scale', 'Continuous Smoked Drum Recorder'],
    },
    component: Experiment98SeismologicalEarthquakeEpicenter,
  },
  {
    meta: {
      id: '099',
      number: '099',
      title: 'Klaus von Klitzing Integer Quantum Hall Effect',
      category: 'Physics & Geometry',
      tags: ['Quantum Hall', 'Landau Levels', 'Von Klitzing Constant', 'Millikelvin'],
      mechanismSignature: '2D Electron Gas in Millikelvin Dilution Fridge -> High Magnetic Field B (Tesla) -> Landau Energy Level Splitting -> Quantized Hall Resistance R_H = h/(nu*e^2)',
      designSignature: 'Typography: Syne Sans · Color: Luminous Cyan Quantized Staircase on Cryogenic Charcoal · Composition: Precision Quantum Metrology Stage',
      description: '1980 Klaus von Klitzing Nobel discovery: 2D electron gas in high magnetic fields exhibits topological Hall resistance plateaus quantized to fundamental constants h/e^2.',
      keyTechnologies: ['Landau Level Filling Factor Mathematics', 'Quantized Hall Resistance Plateau Solver', 'Cryogenic Thermal Broadening'],
    },
    component: Experiment99QuantumHallPlateauResistance,
  },
  {
    meta: {
      id: '100',
      number: '100',
      title: 'Cosmic Microwave Background Relic (CMB 2.725K)',
      category: 'Simulation',
      tags: ['CMB Relic', 'Cosmic Web', 'Planck Satellite', 'Grand Synthesis', '100th Milestone'],
      mechanismSignature: 'Recombination Epoch (z ~ 1100) -> 2.725K Blackbody Photons -> Acoustic Multipole Anisotropy Power Spectrum (l ~ 220) -> Primordial Galactic Web Formation',
      designSignature: 'Typography: Monumental Syne Bold · Color: Planck False-Color Microkelvin Fluctuations & Luminous Galactic Filaments · Composition: Mollweide All-Sky Ellipse',
      description: 'The 100th Milestone Master Synthesis: Cosmic Microwave Background 2.725K radiation relic and the primordial galactic web spanning the universe to form Hello World.',
      keyTechnologies: ['Multipole Legendre Polynomial Synthesis', 'Mollweide Projection All-Sky Math', 'Cosmological Filament Graph Generation'],
    },
    component: Experiment100CosmicMicrowaveBackgroundRelic,
  },
  {
    meta: {
      id: '101',
      number: '101',
      title: 'Cherenkov Luminescent Radiation Reactor',
      category: 'Physics & Geometry',
      tags: ['Cherenkov', 'Blue Glow', 'Reactor Core', 'Relativistic Shockwave'],
      mechanismSignature: 'Subatomic Beta Particle (v > c/n) -> Polarization Shock Cone cos(theta)=1/(beta*n) -> Frank-Tamm Emission Spectrum',
      designSignature: 'Typography: Syne Sans · Color: Luminous Cherenkov Blue (#00a6ff) on Deep Water Pool · Composition: Reactor Fuel Assembly Core',
      description: 'Luminescent Cherenkov optical radiation shockwave generated when charged particles exceed the speed of light in water.',
      keyTechnologies: ['Frank-Tamm Spectral Equation', 'Relativistic Shock Cone Geometry', 'Nuclear Core Reactor Visualization'],
    },
    component: Experiment101CherenkovRadiationReactor,
  },
  {
    meta: {
      id: '102',
      number: '102',
      title: 'Michelson-Morley LIGO Interferometer',
      category: 'Retro & Optics',
      tags: ['Interferometer', 'LIGO', 'Phase Interference', 'Gravitational Wave'],
      mechanismSignature: 'Laser Coherent Beam Splitter -> Orthogonal 4km Resonant Arms -> Piezo Mirror Phase Shift -> Photodiode Interference Fringes',
      designSignature: 'Typography: Instrument Monospace · Color: Laser Ruby & Precision Cyan · Composition: Dual-Arm Optical Interferometer',
      description: 'The Michelson laser interferometer measuring sub-wavelength optical path differences and simulated spacetime strain waves.',
      keyTechnologies: ['Coherent Optical Phase Interference', 'Michelson Beam Splitter Math', 'Photodiode Quadrature Demodulation'],
    },
    component: Experiment102MichelsonInterferometerLIGO,
  },
  {
    meta: {
      id: '103',
      number: '103',
      title: 'Physarum Slime Mold Network Optimization',
      category: 'Simulation',
      tags: ['Slime Mold', 'Biomorphic', 'Tokyo Rail Network', 'Optimal Transport'],
      mechanismSignature: 'Foraging Protoplasmic Veins -> Cytoplasmic Rhythmic Shuttle Streaming -> Hagen-Poiseuille Hydrodynamic Tube Thickening',
      designSignature: 'Typography: Syne Semi-Bold · Color: Bio-Luminescent Slime Gold on Charcoal Agar · Composition: Spanning Tree Network',
      description: 'Physarum polycephalum plasmodial slime mold creating cost-optimal topological transport networks spanning Hello World letters.',
      keyTechnologies: ['Tero-Nakagaki Slime Network Model', 'Hagen-Poiseuille Fluid Resistance', 'Biomorphic Agar Foraging Simulation'],
    },
    component: Experiment103PhysarumSlimeMoldNetwork,
  },
  {
    meta: {
      id: '104',
      number: '104',
      title: 'Supersonic Schlieren Airflow & Shockwaves',
      category: 'Physics & Geometry',
      tags: ['Schlieren', 'Supersonic Flow', 'Prandtl-Meyer', 'Shock Diamond'],
      mechanismSignature: 'Supersonic Wedge (Mach > 1) -> Oblique Shock Discontinuity -> Refractive Index Gradient dn/dy -> Knife-Edge Filtered Collimation',
      designSignature: 'Typography: Space Grotesk · Color: Schlieren Monochromatic Grayscale with Rainbow Tint · Composition: High-Speed Wind Tunnel',
      description: 'Optical Schlieren imaging revealing supersonic shockwaves, expansion fans, and aerodynamic compression around Hello World obstacles.',
      keyTechnologies: ['Toepler Schlieren Optics Math', 'Compressible Gas Shock Geometry', 'Mach Angle & Pressure Gradient Mapping'],
    },
    component: Experiment104SchlierenAirflowSupersonic,
  },
  {
    meta: {
      id: '105',
      number: '105',
      title: 'Stern-Gerlach Quantum Spin Deflection',
      category: 'Physics & Geometry',
      tags: ['Quantum Spin', 'Stern-Gerlach', 'Spatial Quantization', 'Silver Atomic Beam'],
      mechanismSignature: 'Oven Evaporated Silver Atoms -> Inhomogeneous Magnetic Field dB_z/dz -> Magnetic Dipole Force F_z = mu_z*(dB_z/dz) -> Two Quantized Beams',
      designSignature: 'Typography: Instrument Serif · Color: Silver Atomic Stream on Vacuum Chamber Slate · Composition: Pole-Piece Deflection Geometry',
      description: '1922 landmark experiment proving quantum space quantization: neutral silver atom magnetic moments split discretely into Spin +1/2 and -1/2.',
      keyTechnologies: ['Spatial Quantization Physics', 'Inhomogeneous Magnetic Field Gradient', 'Atomic Beam Deflection Kinematics'],
    },
    component: Experiment105SternGerlachQuantumSpin,
  },
  {
    meta: {
      id: '106',
      number: '106',
      title: 'Belousov-Zhabotinsky Chemical Spiral Waves',
      category: 'Simulation',
      tags: ['BZ Reaction', 'Reaction-Diffusion', 'Nonlinear Dynamics', 'Excitability'],
      mechanismSignature: 'Ferroin Catalyst -> Malonic Acid Oxidation-Reduction -> FitzHugh-Nagumo Autocatalytic Waves -> Spiral Rotor Pinwheels',
      designSignature: 'Typography: Syne Sans · Color: Ferriin Blue & Ferroin Crimson Waves · Composition: Petri Dish Chemical Field',
      description: 'Nonlinear chemical oscillator exhibiting self-organizing spiral concentration waves and phase singularities propagating across the dish.',
      keyTechnologies: ['Oregonator / Barkley Cellular Automaton', 'Rotational Phase Singularity Core', 'Excitable Chemical Kinetic Field'],
    },
    component: Experiment106BelousovZhabotinskySpiral,
  },
  {
    meta: {
      id: '107',
      number: '107',
      title: 'Antikythera Mechanism Differential Gears',
      category: 'Retro & Optics',
      tags: ['Antikythera', 'Ancient Computer', 'Bronze Gears', 'Epicyclic Geartrain'],
      mechanismSignature: 'Crown Wheel Crank -> Epicyclic Pin-and-Slot Anomaly Gearing -> 235-Month Metonic Spiral & 223-Month Saros Eclipse Indicator',
      designSignature: 'Typography: Hellenistic Serif · Color: Verdigris Bronze Patina & Gilded Teeth · Composition: Open Differential Mechanism',
      description: 'The world’s first analog mechanical computer (c. 150 BC) computing lunar anomalous motion and celestial cycles with interlocking bronze gears.',
      keyTechnologies: ['Epicyclic Pin-and-Slot Kinematics', 'Archimedean Gear Geometry', 'Ancient Hellenistic Astronomical Math'],
    },
    component: Experiment107AntikytheraMechanismGears,
  },
  {
    meta: {
      id: '108',
      number: '108',
      title: 'Talbot Optical Self-Imaging Carpet',
      category: 'Retro & Optics',
      tags: ['Talbot Effect', 'Diffraction', 'Fresnel Carpet', 'Self-Imaging'],
      mechanismSignature: 'Periodic Transmission Grating (period a) -> Coherent Wavefront Fresnel Diffraction -> Talbot Distance z_T = 2*a^2/lambda -> Integer & Fractional Self-Images',
      designSignature: 'Typography: Archival Monospace · Color: Coherent Monochromatic Emerald Wavefront · Composition: Longitudinal Talbot Carpet',
      description: '1836 Henry Fox Talbot near-field optical phenomenon where periodic grating patterns reproduce perfectly at integer Talbot distances without lenses.',
      keyTechnologies: ['Fresnel Near-Field Diffraction Integral', 'Fractional Talbot Subharmonic Math', 'Optical Interference Wavefront Solver'],
    },
    component: Experiment108TalbotSelfImagingGrating,
  },
  {
    meta: {
      id: '109',
      number: '109',
      title: 'Enigma Electromechanical Permutation Rotor',
      category: 'Typography',
      tags: ['Enigma', 'Cryptography', 'Steckerbrett', 'Permutation Cycles'],
      mechanismSignature: 'Keyboard Contact -> Steckerbrett Plugboard -> 3 Rotor Wiring Permutations -> Umkehrwalze Reflector -> Reciprocal Lampboard Glow',
      designSignature: 'Typography: Military Monospace & Stamped Zinc · Color: Bakelite Black, Brass Contacts, Amber Glow · Composition: Rotor Cross-Section',
      description: '1939 military Enigma cipher machine showing rotor stepping, reciprocal reflector wire pathways, and character encryption permutations.',
      keyTechnologies: ['Polyalphabetic Substitution Group Theory', 'Rotor Stepping Odometry', 'Reciprocal Permutation Graph Engine'],
    },
    component: Experiment109EnigmaRotorPermutation,
  },
  {
    meta: {
      id: '110',
      number: '110',
      title: 'Mercury Acoustic Delay-Line Storage',
      category: 'Audio & Signals',
      tags: ['Delay Line', 'EDSAC Memory', 'Piezo Transducer', 'Acoustic Pulse'],
      mechanismSignature: 'Piezo Quartz Emitter (10 MHz) -> Mercury Liquid Compression Wave (1450 m/s) -> Acoustic Transit Delay -> Receiver Gate Pulse Regeneration Loop',
      designSignature: 'Typography: Cambridge Monospace (1949) · Color: Liquid Mercury Silver & Phosphor Trace · Composition: Acoustic Glass Delay Tube',
      description: '1949 EDSAC computer memory: acoustic ultrasound pulses traveling down liquid mercury tubes to recirculate serial binary bits.',
      keyTechnologies: ['Acoustic Wave Transit Delay Math', 'Piezoelectric Transducer Emulation', 'Recirculating Regenerative Memory Loop'],
    },
    component: Experiment110MercuryDelayLineMemory,
  },
  {
    meta: {
      id: '111',
      number: '111',
      title: 'Zeeman Spectroscopic Hyperfine Splitting',
      category: 'Physics & Geometry',
      tags: ['Zeeman Effect', 'Spectroscopy', 'Magnetic Field', 'Lande g-factor'],
      mechanismSignature: 'Atomic Cadmium Lamp -> External Magnetic Field B -> Orbital Angular Momentum Perturbation Delta E = m_j*g_L*mu_B*B -> Triplet Spectral Line Splitting',
      designSignature: 'Typography: Precision Sans · Color: Cadmium Spectral Red (643.8 nm) & Splitting Sub-Lines · Composition: High-Resolution Spectrograph Plate',
      description: '1896 Pieter Zeeman discovery: magnetic fields split atomic spectral emission lines into distinct polarization components (sigma+, pi, sigma-).',
      keyTechnologies: ['Lande g-Factor Energy Splitting', 'Bohr Magneton Hamiltonian', 'Spectrographic Optical Dispersion'],
    },
    component: Experiment111ZeemanSpectralSplitting,
  },
  {
    meta: {
      id: '112',
      number: '112',
      title: 'Craig Reynolds 3D Boids Flocking Emergence',
      category: 'Simulation',
      tags: ['Boids', 'Flocking', 'Craig Reynolds', 'Autonomous Agents'],
      mechanismSignature: 'Individual Agents -> Separation (collision avoidance) + Alignment (velocity match) + Cohesion (center of mass) -> Global Murmuration Flocking',
      designSignature: 'Typography: Syne Sans · Color: Iridescent Starlings on Dusk Indigo · Composition: 3D Toroidal Volume Murmuration',
      description: '1986 Craig Reynolds artificial life algorithm: three simple local steering rules producing breathtaking emergent flocking murmuration.',
      keyTechnologies: ['Spatial Partitioning Flocking Math', 'Separation-Alignment-Cohesion Steering', '3D Perspective Particle Renderer'],
    },
    component: Experiment112CraigReynoldsBoidsFlock3D,
  },
  {
    meta: {
      id: '113',
      number: '113',
      title: 'Foucault Pendulum Planetary Precession',
      category: 'Physics & Geometry',
      tags: ['Foucault Pendulum', 'Coriolis Force', 'Earth Rotation', 'Pantheon'],
      mechanismSignature: '67m Steel Wire Pendulum -> Fixed Inertial Oscillation Plane -> Terrestrial Coriolis Force -2*(Omega x v) -> Daily Clockwise Precession Omega*sin(phi)',
      designSignature: 'Typography: Paris Panthéon Classical Serif · Color: Gilded Brass Bob over Sand Dial · Composition: Top-Down Precession Rose',
      description: '1851 Léon Foucault Panthéon experiment providing direct visual proof of Earth’s diurnal rotation via the slow precession of an oscillating bob.',
      keyTechnologies: ['Coriolis Acceleration Vector Solver', 'Spherical Pendulum Runge-Kutta', 'Sand Rose Tracing Canvas Engine'],
    },
    component: Experiment113FoucaultPendulumPrecession,
  },
  {
    meta: {
      id: '114',
      number: '114',
      title: 'Kundt Acoustic Resonant Dust Tube',
      category: 'Audio & Signals',
      tags: ['Kundt Tube', 'Acoustic Nodes', 'Lycopodium Dust', 'Standing Waves'],
      mechanismSignature: 'Audio Piston Exciter -> Closed Air Column (v_sound ~ 343 m/s) -> Acoustic Standing Wave -> Lycopodium Dust Accumulation at Velocity Nodes',
      designSignature: 'Typography: Laboratory Monospace · Color: Glowing Acoustic Waveform & Amber Dust Heaps · Composition: Longitudinal Glass Resonance Tube',
      description: '1866 August Kundt acoustic apparatus visualizing sound wavelengths and velocity via dust powder ridges gathered at standing wave nodes.',
      keyTechnologies: ['Resonant Standing Wave Equations', 'Acoustic Radiation Force Dust Solver', 'Realtime Synthesized Audio Tone Hook'],
    },
    component: Experiment114KundtAcousticDustTube,
  },
  {
    meta: {
      id: '115',
      number: '115',
      title: 'Casimir Quantum Vacuum Plate Attraction',
      category: 'Physics & Geometry',
      tags: ['Casimir Effect', 'Quantum Vacuum', 'Zero-Point Energy', 'Nanoscale'],
      mechanismSignature: 'Parallel Conducting Metal Plates -> Spatial Mode Cutoff for Vacuum Zero-Point Modes (E_0 = 1/2 hbar*omega) -> Net Attractive Pressure F/A = pi^2*hbar*c / (240*d^4)',
      designSignature: 'Typography: Space Monospace · Color: Mirror Gold Plates & Quantum Vacuum Fluctuation Foam · Composition: Nanometer Gap Micro-Stage',
      description: '1948 Hendrik Casimir quantum electrodynamics phenomenon: uncharged conductive mirrors attract solely due to excluded vacuum electromagnetic modes.',
      keyTechnologies: ['Zero-Point Energy Mode Summation', 'Casimir Inverse Quartic Force (1/d^4)', 'Quantum Fluctuation Stochastic Field'],
    },
    component: Experiment115CasimirVacuumForcePlates,
  },
  {
    meta: {
      id: '116',
      number: '116',
      title: 'Shepard Ascending Infinite Auditory Illusion',
      category: 'Audio & Signals',
      tags: ['Shepard Scale', 'Auditory Illusion', 'Infinite Pitch', 'Web Audio API'],
      mechanismSignature: 'Complex Octave Tone Cluster -> Gaussian Spectral Envelope -> Circular Chromatic Pitch Shift -> Perceived Endlessly Ascending Glissando',
      designSignature: 'Typography: Musical Notation Sans · Color: Pitch Helix Chromatic Rainbow on Night Velvet · Composition: 12-Tone Circle of Fifths Spiral',
      description: '1964 Roger Shepard auditory paradox: overlapping sine waves spaced at octaves with a fixed bell curve envelope that seems to climb upwards forever.',
      keyTechnologies: ['Web Audio API Multi-Oscillator Bank', 'Gaussian Spectral Amplitude Envelope', 'Continuous Shepard-Risset Pitch Spiral'],
    },
    component: Experiment116ShepardScaleInfiniteTone,
  },
  {
    meta: {
      id: '117',
      number: '117',
      title: 'Optical Airy Disk & Bessel Diffraction',
      category: 'Retro & Optics',
      tags: ['Airy Disk', 'Diffraction Limit', 'Rayleigh Criterion', 'Bessel Function'],
      mechanismSignature: 'Circular Aperture -> Monochromatic Point Source -> Fraunhofer Diffraction Integral -> 2D Intensity Pattern I(theta) = [2*J_1(x)/x]^2 Rings',
      designSignature: 'Typography: Astronomical Grotesk · Color: Monochromatic High-Dynamic Laser Rings on Deep Space · Composition: 3D Surface & 2D Radial Rings',
      description: '1835 George Biddell Airy diffraction pattern defining the fundamental physical resolution limit (Rayleigh criterion) of telescopes and microscopes.',
      keyTechnologies: ['First-Order Bessel Function J_1(x)', 'Fraunhofer Circular Aperture Transform', 'Rayleigh Criterion Dual-Source Resolver'],
    },
    component: Experiment117AiryDiskDiffractionPattern,
  },
  {
    meta: {
      id: '118',
      number: '118',
      title: '1972 Magnavox Odyssey Discrete Analog CRT Beam',
      category: 'Retro & Optics',
      tags: ['Magnavox Odyssey', 'Ralph Baer', 'Discrete Logic', 'CRT Phosphor'],
      mechanismSignature: 'Diode-Transistor Logic Timers -> Horizontal / Vertical Ramp Comparators -> Discrete White Spot Generators -> Cellophane Color TV Screen Overlay',
      designSignature: 'Typography: 1970s Television Monospace · Color: Color Screen Acetate Plastic Overlay & White Phosphor Blocks · Composition: Vintage CRT TV',
      description: '1972 Ralph Baer first commercial home video game console: purely analog discrete diode-transistor circuits steering spots on CRT phosphors without a CPU.',
      keyTechnologies: ['Analog Diode-Transistor Spot Timing', 'CRT Beam Raster Sweep Simulation', 'Authentic 1972 Screen Overlay Shader'],
    },
    component: Experiment118MagnavoxOdysseyCRTBeam,
  },
  {
    meta: {
      id: '119',
      number: '119',
      title: 'Phased Array Electronic Beamsteering Radar',
      category: 'Audio & Signals',
      tags: ['Phased Array', 'Beamsteering', 'Constructive Interference', 'AESA Radar'],
      mechanismSignature: 'Linear Array of N Dipole Emitters -> Controlled Progressive Phase Shifts Delta Phi = k*d*sin(theta_0) -> Steered Constructive Main Beam Without Moving Parts',
      designSignature: 'Typography: Military Avionics Monospace · Color: Radar Emerald Vector Beam on Tactical HUD · Composition: Emitter Antenna Array Base',
      description: 'Active electronically scanned array (AESA) radar steering electromagnetic radiation beams at the speed of light via constructive wave phase interference.',
      keyTechnologies: ['Array Factor Interference Equation', 'Phase Shifter Beam-Pointing Vector Math', 'Polar Radiation Gain Pattern Visualizer'],
    },
    component: Experiment119PhasedArrayBeamsteering,
  },
  {
    meta: {
      id: '120',
      number: '120',
      title: 'Mandelbrot Arbitrary-Precision Fractal Deep Zoom',
      category: 'Physics & Geometry',
      tags: ['Mandelbrot', 'Complex Dynamics', 'Fractal Zoom', 'Escape Time'],
      mechanismSignature: 'Complex Plane z_(n+1) = z_n^2 + c -> Iterative Escape Time Algorithm (|z| > 2) -> Boundary Fractal Self-Similarity & Hello World Island',
      designSignature: 'Typography: Precision Grotesk · Color: Smooth Continuous Potential Color Palette · Composition: Realtime Interactive Pan-Zoom Viewport',
      description: '1980 Benoit Mandelbrot iconic mathematical fractal exploring infinite complexity, cardioid boundaries, and recursive mini-brot structures.',
      keyTechnologies: ['Continuous Potential Escape-Time Algorithm', 'Arbitrary Floating Pan-Zoom Coordinate Solver', 'Optimized Canvas Byte Array Pixel Generator'],
    },
    component: Experiment120MandelbrotFractalDeepZoom,
  },
  {
    meta: {
      id: '121',
      number: '121',
      title: 'Josephson Junction Superconducting SQUID',
      category: 'Physics & Geometry',
      tags: ['Josephson Junction', 'SQUID', 'Superconductivity', 'Cooper Pairs'],
      mechanismSignature: 'Cooper Pair Quantum Phase Difference Delta Phi -> DC Josephson Current I = I_c*sin(Delta Phi) -> Magnetic Flux Quantization Phi_0 = h/(2e) in SQUID Ring',
      designSignature: 'Typography: Cryogenic Sans · Color: Superconducting Niobium Cyan on Dilution Stage Charcoal · Composition: Dual-Junction SQUID Loop',
      description: '1962 Brian Josephson discovery: quantum tunneling of Cooper pairs across thin insulators enabling femtotesla-sensitive SQUID magnetic sensors.',
      keyTechnologies: ['DC Josephson Effect Equations', 'Magnetic Flux Quantum (Phi_0) Interference', 'Cryogenic Phase-Voltage Characteristics'],
    },
    component: Experiment121JosephsonJunctionSQUID,
  },
  {
    meta: {
      id: '122',
      number: '122',
      title: 'Williams-Kilburn CRT Electrostatic Storage Tube',
      category: 'Retro & Optics',
      tags: ['Williams Tube', 'Manchester Baby', 'Secondary Emission', '1948 RAM'],
      mechanismSignature: 'Focused CRT Electron Beam -> Secondary Electron Emission on Phosphor Screen -> Localized Positive Well (Bit 1) vs Flat Charge (Bit 0) -> Capacitive Metal Pickup Plate Readout',
      designSignature: 'Typography: Manchester Baby (1948) Monospace · Color: P1 Green Cathode Phosphor & Stenciled Brass Plate · Composition: 32x32 Storage Raster',
      description: '1948 Freddie Williams and Tom Kilburn first random-access electronic computer memory (Manchester Baby) storing bits as electrostatic charges on a CRT face.',
      keyTechnologies: ['Secondary Electron Emission Charge Well Math', 'Capacitive Readout Pulse Detection', 'Periodic Regenerative Refresh Cycle'],
    },
    component: Experiment122WilliamsKilburnCRTMemory,
  },
  {
    meta: {
      id: '123',
      number: '123',
      title: 'Kerr Electro-Optic Sub-Nanosecond Shutter',
      category: 'Retro & Optics',
      tags: ['Kerr Cell', 'Electro-Optics', 'Birefringence', 'High Speed Laser'],
      mechanismSignature: 'Nitrobenzene Cell -> High Voltage Pulse (kV) -> Induced Optical Anisotropy Delta n = K*lambda*E^2 -> Crossed Polarizer Optical Gate Transmittance',
      designSignature: 'Typography: Ultra-Fast Optical Monospace · Color: High-Voltage Violet Spark & Transmitted Crimson Beam · Composition: Cross-Polarizer Bench',
      description: '1875 John Kerr quadratic electro-optic effect creating picosecond-speed optical shutters without moving mechanical parts for laser pulsing and ballistics.',
      keyTechnologies: ['Quadratic Kerr Electro-Optic Formula', 'Jones Matrix Polarization Transformation', 'High-Voltage Pulse Timing Engine'],
    },
    component: Experiment123KerrElectroOpticShutter,
  },
  {
    meta: {
      id: '124',
      number: '124',
      title: 'Cytoplasmic Streaming & Chloroplast Micro-Flow',
      category: 'Simulation',
      tags: ['Cytoplasmic Streaming', 'Actin-Myosin', 'Chloroplasts', 'Chara Plant Cell'],
      mechanismSignature: 'Actin Microfilament Tracks -> Myosin Motor Protein Hydrolysis -> Hydrodynamic Cytosol Shear -> Chloroplast Orbital Circulation around Vacuole',
      designSignature: 'Typography: Botanical Microscopy Serif · Color: Chlorophyll Emerald on Cytosolic Amber · Composition: Giant Chara Plant Internodal Cell',
      description: 'Biophysical intracellular transport: ATP-powered myosin motors pulling organelles along sub-membrane actin cables to circulate nutrients in plant cells.',
      keyTechnologies: ['Myosin Step Motor Simulation', 'Low-Reynolds Number Hydrodynamic Drag', 'Intracellular Plant Cell Morphometrics'],
    },
    component: Experiment124CytoplasmicStreamingChloroplast,
  },
  {
    meta: {
      id: '125',
      number: '125',
      title: 'Cavendish Torsion Balance Gravitational G',
      category: 'Physics & Geometry',
      tags: ['Cavendish Experiment', 'Gravitational Constant', 'Torsion Balance', 'Weighing Earth'],
      mechanismSignature: 'Light Dumbbell with Small Lead Spheres (m) on Quartz Fiber -> Large External Lead Spheres (M) -> Gravitational Force G*M*m/r^2 -> Torsion Angle Optical Lever Mirror',
      designSignature: 'Typography: 1798 Royal Society Copperplate · Color: Burnished Lead Gray, Quartz Reflection Beam · Composition: Draught-Proof Wooden Box',
      description: '1798 Henry Cavendish experiment "weighing the Earth": measuring the minuscule gravitational attraction between lead balls with a delicate torsion wire.',
      keyTechnologies: ['Newtonian Gravitational Force Solver', 'Torsion Pendulum Angular Harmonic Oscillation', 'Optical Lever Beam Amplification'],
    },
    component: Experiment125CavendishTorsionGravityBalance,
  },
  {
    meta: {
      id: '126',
      number: '126',
      title: 'Sagnac Optical Fiber Laser Gyroscope',
      category: 'Retro & Optics',
      tags: ['Sagnac Effect', 'Fiber Gyroscope', 'Relativistic Optics', 'Interferometry'],
      mechanismSignature: 'Counter-Propagating Laser Beams in Fiber Coil -> Rotational Angular Velocity Omega -> Relativistic Phase Difference Delta Phi = 4*pi*L*R*Omega / (c*lambda) -> Fringe Shift',
      designSignature: 'Typography: Avionics Monospace · Color: Coherent Emerald Counter-Propagating Beams · Composition: Fiber Optic Spool Stage',
      description: '1913 Georges Sagnac optical rotation effect used in aerospace navigation: phase shifts between clockwise and counter-clockwise laser beams in a rotating loop.',
      keyTechnologies: ['Sagnac Relativistic Phase Shift Math', 'Fiber Optic Waveguide Dispersion', 'Digital Demodulation Phase Lock'],
    },
    component: Experiment126SagnacOpticalFiberGyroscope,
  },
  {
    meta: {
      id: '127',
      number: '127',
      title: 'Rayleigh-Bénard Thermal Convection Cells',
      category: 'Simulation',
      tags: ['Rayleigh-Benard', 'Thermal Convection', 'Hexagonal Cells', 'Buoyancy'],
      mechanismSignature: 'Heated Bottom Plate -> Thermal Buoyancy Exceeds Viscous Dissipation (Ra > Ra_c ~ 1708) -> Self-Organized Hexagonal Bénard Convection Rolls',
      designSignature: 'Typography: Fluid Dynamics Sans · Color: Thermal Flame Orange Ascent & Cryogenic Cyan Descent · Composition: Microscopic Liquid Layer',
      description: '1900 Henri Bénard fluid instability: liquid heated from below spontaneously organizes into regular hexagonal rolling convection cells.',
      keyTechnologies: ['Boussinesq Thermal Convection Math', 'Rayleigh Number Stability Criteria', '2D Hexagonal Cellular Velocity Field'],
    },
    component: Experiment127RayleighBenardConvectionCells,
  },
  {
    meta: {
      id: '128',
      number: '128',
      title: 'Geissler Noble Gas Spectral Discharge Tubes',
      category: 'Retro & Optics',
      tags: ['Geissler Tube', 'Noble Gases', 'Cold Plasma', 'High Voltage'],
      mechanismSignature: 'Ruhmkorff Induction Coil (5 kV) -> Rarefied Gas Ionization -> Electron Impact Excitation -> Characteristic Quantum De-Excitation Emission Spectra',
      designSignature: 'Typography: Victorian Scientific Script & Monospace · Color: Neon Crimson, Argon Violet, Helium Peach, Xenon Sky · Composition: Blown Glass Ampoule Rack',
      description: '1857 Heinrich Geissler low-pressure gas discharge tubes exhibiting glowing cold plasma and the spectral emission lines of noble gases.',
      keyTechnologies: ['Quantum Atomic De-Excitation Colors', 'Cold Plasma Glow Column Breakdown', 'High-Voltage Ruhmkorff Coil Emulation'],
    },
    component: Experiment128GeisslerGasDischargeTubes,
  },
  {
    meta: {
      id: '129',
      number: '129',
      title: 'Triboelectric Van de Graaff Electrostatic Generator',
      category: 'Physics & Geometry',
      tags: ['Van de Graaff', 'Electrostatics', 'Corona Discharge', 'Spark Gap'],
      mechanismSignature: 'Rotating Rubber Belt -> Triboelectric Friction with Teflon/Nylon Roller -> Charge Carried to Hollow Metal Sphere -> Megavolt Accumulation & Dielectric Breakdown Sparks',
      designSignature: 'Typography: High-Voltage Monospace · Color: Polished Aluminum Dome & Electric Blue Corona Lightning · Composition: Elevation Cross-Section',
      description: '1929 Robert Van de Graaff electrostatic generator accumulating millions of volts on a metal terminal dome to produce massive dielectric air sparks.',
      keyTechnologies: ['Triboelectric Series Contact Charging', 'Gauss Law Charge Migration to Outer Surface', 'Dielectric Breakdown Spark Branching'],
    },
    component: Experiment129TriboelectricVanDeGraaffGenerator,
  },
  {
    meta: {
      id: '130',
      number: '130',
      title: 'Hopfield Associative Neural Energy Landscape',
      category: 'Simulation',
      tags: ['Hopfield Network', 'Associative Memory', 'Lyapunov Energy', 'Attractor Dynamics'],
      mechanismSignature: 'Hebbian Synaptic Weight Matrix W_ij -> Recurrent Threshold Updates s_i = sgn(sum W_ij s_j) -> Monotonic Descent on Lyapunov Energy E = -1/2 sum W_ij s_i s_j -> Pattern Recall',
      designSignature: 'Typography: Cybernetic Monospace · Color: Spin Glass Emerald Lattice & Energy Minima · Composition: Binary Neuron Grid & Energy Basin',
      description: '1982 John Hopfield recurrent neural network storing memories as attractors on an energy surface, reconstructing distorted patterns into crisp letters.',
      keyTechnologies: ['Hebbian Learning Rule Storage Matrix', 'Lyapunov Energy Function Minimization', 'Synchronous / Asynchronous Spin Relaxation'],
    },
    component: Experiment130HopfieldAssociativeMemoryNetwork,
  },
  {
    meta: {
      id: '131',
      number: '131',
      title: 'Raman Inelastic Molecular Spectroscopy',
      category: 'Retro & Optics',
      tags: ['Raman Scattering', 'Stokes Shifts', 'Vibrational Modes', 'Molecular Fingerprint'],
      mechanismSignature: 'Monochromatic Laser Photon (omega_0) -> Molecular Bond Polarization Inelastic Scattering -> Stokes (omega_0 - omega_v) & Anti-Stokes (omega_0 + omega_v) Sidebands',
      designSignature: 'Typography: Chemical Spectroscopy Sans · Color: Rayleigh Peak Green & Luminous Raman Stokes Fingerprints · Composition: Spectrometer CCD CCD Array',
      description: '1928 C.V. Raman Nobel discovery: inelastically scattered photons revealing characteristic vibrational finger-prints of chemical bonds.',
      keyTechnologies: ['Inelastic Photon-Phonon Scattering', 'Stokes / Anti-Stokes Wavenumber Math', 'High-Resolution Diffraction Grating Dispersion'],
    },
    component: Experiment131RamanScatteringSpectroscopy,
  },
  {
    meta: {
      id: '132',
      number: '132',
      title: 'Orthogonal Dual-Galvo Lissajous Laser Harmonics',
      category: 'Audio & Signals',
      tags: ['Lissajous', 'Galvanometer', 'Laser Projector', 'Harmonic Ratio'],
      mechanismSignature: 'Dual Audio Oscillators (f_x : f_y) -> Moving Coil Galvanometer Mirrors -> Orthogonal Deflection Angles -> Continuous Lissajous Harmonic Figures',
      designSignature: 'Typography: Vector Display Grotesk · Color: Laser Phosphor Green on Black Void · Composition: Vector Oscilloscope Display',
      description: 'Orthogonal galvo mirror scanner deflecting laser beams into parametric Lissajous harmonic knots, revealing frequency ratios and phase differences.',
      keyTechnologies: ['Parametric Lissajous Equations x(t)=sin(at+d), y(t)=sin(bt)', 'Moving-Coil Galvanometer Inertia Model', 'High-Speed Vector Beam Phosphor Decay'],
    },
    component: Experiment132LissajousOpticalLaserHarmonics,
  },
  {
    meta: {
      id: '133',
      number: '133',
      title: 'Peltier Thermoelectric Semiconductor Heat Pump',
      category: 'Physics & Geometry',
      tags: ['Peltier Effect', 'Thermoelectric', 'Seebeck', 'Solid State Cooling'],
      mechanismSignature: 'Bismuth Telluride (Bi2Te3) p-n Couples -> Direct Current Flow -> Heat Absorption at Cold Junction (Q_c = Pi*I) & Heat Dissipation at Hot Sink -> Carnot Temperature Gradient',
      designSignature: 'Typography: Cryogenic Hardware Monospace · Color: Sub-Zero Ice Blue & Ceramic Hot Amber · Composition: Solid-State Thermocouple Cross-Section',
      description: '1834 Jean Peltier solid-state thermoelectric heat pump transferring heat between semiconductor junctions via electric current without moving parts.',
      keyTechnologies: ['Peltier Heat Pumping Rate Equations', 'Joule Internal Resistance Heating Loss', 'Heat Sink Thermal Equilibrium Modeler'],
    },
    component: Experiment133PeltierThermoelectricHeatPump,
  },
  {
    meta: {
      id: '134',
      number: '134',
      title: 'Gabor Coherent Holographic Wavefront Reconstruction',
      category: 'Retro & Optics',
      tags: ['Holography', 'Dennis Gabor', 'Wavefront Reconstruction', 'Interference Pattern'],
      mechanismSignature: 'Reference Wave E_ref + Object Scattered Wave E_obj -> Square-Law Intensity Interference Pattern on Emulsion -> Diffraction of Reference Beam Reconstructs 3D Virtual Wavefront',
      designSignature: 'Typography: Optical Hologram Serif · Color: Ruby Laser Interference Fringe Iridescence · Composition: Holographic Plate & 3D Virtual Image',
      description: '1948 Dennis Gabor Nobel invention of holography: recording the complete amplitude and phase of optical waves on film to reconstruct a floating 3D wavefront.',
      keyTechnologies: ['Complex Optical Wavefront Addition', 'Interference Fringe Micro-Grating Pattern', 'Diffractive Virtual Image Reconstruction'],
    },
    component: Experiment134GaborHolographicWavefront,
  },
  {
    meta: {
      id: '135',
      number: '135',
      title: 'De Broglie Matter Wave Quantum Diffraction',
      category: 'Physics & Geometry',
      tags: ['De Broglie', 'Wave-Particle Duality', 'Davisson-Germer', 'Electron Diffraction'],
      mechanismSignature: 'Accelerated High-Energy Electrons (V) -> De Broglie Wavelength lambda = h/p = h/sqrt(2*m*e*V) -> Polycrystalline Graphite Atomic Lattice Diffraction Rings',
      designSignature: 'Typography: Quantum Physics Serif · Color: Luminescent Green Phosphor Diffraction Rings · Composition: Evacuated Spherical Electron Diffraction Tube',
      description: '1927 Davisson-Germer confirmation of Louis de Broglie’s hypothesis: electrons exhibiting wave-particle duality by diffracting through atomic graphite planes.',
      keyTechnologies: ['De Broglie Relativistic Wavelength Math', 'Bragg Crystal Lattice Diffraction (2d sin theta = n lambda)', 'Phosphor Electron Detection Geometry'],
    },
    component: Experiment135DeBroglieMatterWaveDiffraction,
  },
  {
    meta: {
      id: '136',
      number: '136',
      title: 'Jocelyn Bell Radio Astronomy Pulsar (PSR B1919+21)',
      category: 'Audio & Signals',
      tags: ['Pulsar', 'Jocelyn Bell', 'Neutron Star', 'Radio Astronomy', 'CP 1919'],
      mechanismSignature: 'Rotating Highly Magnetized Neutron Star -> Relativistic Beams of Synchrotron Radio Radiation -> Interstellar Dispersion Sweep -> Periodic 1.337-Second Radio Pulses',
      designSignature: 'Typography: Cambridge Radio Astronomy Sans · Color: Luminous Pulsar Traces on Cosmic Void (Joy Division CP 1919 Style) · Composition: Stacked Waterfall Pulse Profiles',
      description: '1967 Jocelyn Bell Burnell discovery of pulsars: rapid, clockwork radio emissions from rotating neutron stars in deep space.',
      keyTechnologies: ['Radio Pulse Dispersion Delay Math', 'Stacked Waterfall Trace Chart Engine', 'Synchronized Auditory Radio Static Clicks'],
    },
    component: Experiment136PulsarRadioAstronomyJocelynBell,
  },
  {
    meta: {
      id: '137',
      number: '137',
      title: 'Biot-Savart Magnetostatic Current Loop Field',
      category: 'Physics & Geometry',
      tags: ['Biot-Savart', 'Magnetostatics', 'Current Loop', 'Vector Field'],
      mechanismSignature: 'Circular Wire Carrying Direct Current I -> Differential Line Elements dL -> Biot-Savart Integral dB = (mu_0 / 4*pi) * (I * dL x r_hat) / r^2 -> Dipole Field Lines',
      designSignature: 'Typography: Classical Physics Serif · Color: Copper Conductor Ring & Electric Cyan Vector Flux Streamlines · Composition: 3D Toroidal Dipole Stage',
      description: '1820 Jean-Baptiste Biot and Félix Savart law calculating the continuous magnetostatic vector flux field generated by a circular current loop.',
      keyTechnologies: ['Numerical Biot-Savart Line Integral Solver', 'Runge-Kutta Magnetic Field Line Streamline Tracer', '3D Interactive Orthogonal Slice Projection'],
    },
    component: Experiment137BiotSavartMagneticLoop,
  },
  {
    meta: {
      id: '138',
      number: '138',
      title: 'Feynman-Smoluchowski Thermal Brownian Ratchet',
      category: 'Physics & Geometry',
      tags: ['Brownian Ratchet', 'Feynman Lectures', 'Second Law', 'Thermal Rectifier'],
      mechanismSignature: 'Paddle Vanes in Hot Gas Bath (T1) -> Asymmetric Ratchet & Spring Pawl in Cold Bath (T2) -> Net Directional Rotation Rectifying Heat into Work when T1 > T2',
      designSignature: 'Typography: Caltech Physics Sans · Color: Brass Ratchet Tooth, Thermal Orange Vanes, Cryogenic Pawl · Composition: Dual-Reservoir Insulated Box',
      description: 'Richard Feynman’s famous thermodynamic thought experiment exploring microscopic thermal fluctuations, detailed balance, and the Second Law of Thermodynamics.',
      keyTechnologies: ['Brownian Fluctuation Langevin Dynamics', 'Detailed Balance & Thermal Rectification Math', 'Mechanical Ratchet-Pawl Collision Kinematics'],
    },
    component: Experiment138BrownianRatchetFeynmanSmoluchowski,
  },
  {
    meta: {
      id: '139',
      number: '139',
      title: 'Stirling Regenerative Hot-Air Heat Engine',
      category: 'Physics & Geometry',
      tags: ['Stirling Engine', 'Thermodynamics', 'PV Diagram', 'Carnot Cycle'],
      mechanismSignature: 'Burner Heat Expansion -> 90-Degree Phase Displacer -> Cold Water Compression -> Regenerator Matrix Thermal Storage -> Mechanical Flywheel Shaft Work',
      designSignature: 'Typography: Industrial Revolution Serif · Color: Polished Brass Flywheel & Flame Amber on Slate · Composition: Concentric Stirling Engine & PV Indicator Loop',
      description: '1816 Robert Stirling regenerative thermodynamic heat engine generating clean mechanical shaft power with live real-time P-V indicator state loop.',
      keyTechnologies: ['Thermodynamic State Equations P-V Loop', 'Carnot Maximum Theoretical Efficiency', 'Coupled Kinematic Piston-Flywheel Linkage'],
    },
    component: Experiment139StirlingHotAirEngine,
  },
  {
    meta: {
      id: '140',
      number: '140',
      title: 'Terrestrial Schumann Ionosphere Cavity Resonance',
      category: 'Audio & Signals',
      tags: ['Schumann Resonance', 'Ionosphere', 'Tesla Wave', 'ELF Waves'],
      mechanismSignature: 'Global Lightning Discharges (50/sec) -> Earth-Ionosphere Spherical Waveguide -> Speed-of-Light Circumference Standing Wave Modes (7.83 Hz, 14.3 Hz, 20.8 Hz)',
      designSignature: 'Typography: Geodesic Monospace · Color: Ionospheric Electric Cyan & Deep Ocean Terrestrial Globe · Composition: Spherical Shell Waveguide Cross-Section',
      description: '1952 Winfried Otto Schumann discovery: extremely low frequency (ELF) electromagnetic standing waves vibrating in the resonant cavity between Earth and the ionosphere.',
      keyTechnologies: ['Spherical Waveguide Eigenmode Equations', 'Global Lightning Stochastic Excitation', 'Realtime Power Spectral Density Bar Monitor'],
    },
    component: Experiment140SchumannIonosphereResonance,
  },
  {
    meta: {
      id: '141',
      number: '141',
      title: 'Maxwell’s Microscopic Demon Thermodynamic Gate',
      category: 'Simulation',
      tags: ['Maxwells Demon', 'Thermodynamic Entropy', 'Landauer Limit', 'Information Work'],
      mechanismSignature: 'Gas Chamber Partition -> Intelligent Demon Operates Microscopic Trapdoor -> Fast Particles Filtered Right, Slow Particles Left -> Entropy Reduction & Information Erasure',
      designSignature: 'Typography: Cyber-Thermodynamics Sans · Color: Thermal Plasma Crimson (Hot) & Cryogenic Azure (Cold) · Composition: Dual-Chamber Particle Reservoir',
      description: '1867 James Clerk Maxwell paradox: an intelligent entity sorting gas particles to decrease thermodynamic entropy, resolved by Landauer’s information erasure principle.',
      keyTechnologies: ['Kinetic Gas Elastic Particle Simulation', 'Landauer Bound E_diss = k_B*T*ln(2)', 'Realtime Microscopic Entropy (Delta S) Calculator'],
    },
    component: Experiment141MaxwellsDemonEntropyGate,
  },
  {
    meta: {
      id: '142',
      number: '142',
      title: 'Crookes Radiometer Thermal Transpiration Mill',
      category: 'Physics & Geometry',
      tags: ['Crookes Radiometer', 'Thermal Creep', 'Knudsen Number', 'Solar Vanes'],
      mechanismSignature: 'Incident Photon Flux -> Black Vane Face Absorbs Heat -> Edge Thermal Creep / Transpiration in Rarefied Gas (0.05 mbar) -> Asymmetric Gas Recoil Drives Spin',
      designSignature: 'Typography: Victorian Physics Monospace · Color: Blown Glass Bulb Transparency, Silver & Soot Vanes · Composition: Jewel Pivot Vacuum Mill',
      description: '1873 William Crookes light mill: lightweight vanes spinning in partial vacuum driven by thermal transpiration and molecular gas recoil on heated black faces.',
      keyTechnologies: ['Knudsen Number Gas Transpiration Math', 'Thermal Absorption Radiometric Torque Solver', '3D Perspective Rotating Vane Visualizer'],
    },
    component: Experiment142CrookesRadiometerVanes,
  },
  {
    meta: {
      id: '143',
      number: '143',
      title: 'Acousto-Optic Bragg Crystal Laser Deflector',
      category: 'Retro & Optics',
      tags: ['Acousto-Optics', 'Bragg Deflector', 'TeO2 Crystal', 'Ultrasonic Modulator'],
      mechanismSignature: 'Piezo Transducer 80 MHz RF -> Acoustic Compression Wave in TeO2 Crystal -> Periodic Refractive Index Phase Grating -> Light Diffracted into +1st Bragg Order',
      designSignature: 'Typography: Laser Metrology Sans · Color: Helium-Neon Ruby Laser Beam (632.8 nm) & Acoustic Cyan Pressure Waves · Composition: Acousto-Optic Cell Bench',
      description: 'High-speed solid-state laser deflection and modulation: ultrasonic sound waves in a crystal forming a dynamic phase grating that diffracts laser light without mirrors.',
      keyTechnologies: ['Bragg Diffraction Condition theta_B = lambda / (2*Lambda)', 'Acoustic Phase Grating Transmittance', 'First-Order Efficiency Sinusoidal Power Curve'],
    },
    component: Experiment143AcoustoOpticBraggCell,
  },
  {
    meta: {
      id: '144',
      number: '144',
      title: 'Non-Orientable 4D Klein Bottle Topological Immersion',
      category: 'Physics & Geometry',
      tags: ['Klein Bottle', 'Topology', 'Non-Orientable', '4D Immersion', 'Differential Geometry'],
      mechanismSignature: 'Parametric Figure-8 Surface u, v in [0, 2*pi] -> 4D Euclidean Space Projection into 3D -> One-Sided Non-Orientable Manifold with Zero Volume & No Edge',
      designSignature: 'Typography: Mathematical Topology Serif · Color: Spectral Depth-Lit Iridescence on Velvet Void · Composition: Dynamic Wireframe Figure-8 Immersion',
      description: 'The iconic non-orientable topological manifold: a closed 2D surface with no boundary and only a single continuous side, seamlessly passing through itself in 3D space.',
      keyTechnologies: ['Figure-8 Klein Bottle Parametric Geometry', '3D Hyper-Rotation Projection Matrix', 'Depth-Buffered Spectral Shading Pipeline'],
    },
    component: Experiment144KleinBottleTopologicalImmerse,
  },
  {
    meta: {
      id: '145',
      number: '145',
      title: 'Galvanomagnetic Hall Effect Carrier Probe',
      category: 'Physics & Geometry',
      tags: ['Hall Effect', 'Lorentz Force', 'Carrier Concentration', 'Solid State Physics'],
      mechanismSignature: 'Semiconductor Ribbon Carrying Current I_x -> Perpendicular Magnetic Field B_z -> Lorentz Force F_y = q*(v x B) -> Transverse Hall Voltage V_H Accumulation',
      designSignature: 'Typography: Semiconductor Physics Monospace · Color: Electron Azure vs Hole Magenta & Gold Contacts · Composition: Micro-Ribbon Stage & Digital Voltmeter',
      description: '1879 Edwin Hall discovery: magnetic deflection of mobile charge carriers creating transverse electric potential, measuring carrier concentration and polarity.',
      keyTechnologies: ['Lorentz Force Vector Drift Kinematics', 'Hall Coefficient R_H = 1 / (n*q)', 'Digital Electrometer Millivolt Readout Hook'],
    },
    component: Experiment145HallEffectSemiconductorCarrier,
  },
  {
    meta: {
      id: '146',
      number: '146',
      title: 'Heavy Gyroscopic Precession & Nutation Dynamics',
      category: 'Physics & Geometry',
      tags: ['Gyroscope', 'Precession', 'Nutation', 'Angular Momentum'],
      mechanismSignature: 'Spinning Brass Rotor (L = I*omega) on Gimbal Pivot -> Gravitational Torque tau = r x F_g -> Gyroscopic Precession Omega_p = tau / L & High-Frequency Nutation Loops',
      designSignature: 'Typography: Classical Mechanics Serif · Color: Gilded Brass Rotor, Polished Steel Gimbal, Azure Tip Trajectory · Composition: Balanced Gyroscope Rig',
      description: 'Conservation of angular momentum in rotating rigid bodies: high-speed gyroscopes counter-intuitively defying gravity by precessing and nutating in looping cusps.',
      keyTechnologies: ['Rigid Body Euler Gyroscopic Equations', 'Angular Momentum & Torque Cross-Product Solver', 'Precession-Nutation Trajectory Path Tracer'],
    },
    component: Experiment146GyroscopicPrecessionNutation,
  },
  {
    meta: {
      id: '147',
      number: '147',
      title: 'Wilson Expansion Cloud Chamber Ionization Tracks',
      category: 'Physics & Geometry',
      tags: ['Cloud Chamber', 'Wilson Chamber', 'Alpha Particles', 'Cosmic Muons', 'Particle Physics'],
      mechanismSignature: 'Supersaturated Isopropyl Alcohol Vapor -> High-Energy Particle Ionization -> Ion Nucleation Sites -> Visible Liquid Droplet Condensation Trails',
      designSignature: 'Typography: Nuclear Physics Monospace · Color: Thick White Alpha Bragg Peaks, Curving Beta Helices, Cosmic Muons · Composition: Chilled Vapor Chamber Stage',
      description: '1911 C.T.R. Wilson Nobel invention: supersaturated vapor condensing on ionization trails to reveal the microscopic paths of subatomic alpha, beta, and cosmic rays.',
      keyTechnologies: ['Supersaturated Vapor Droplet Nucleation Math', 'Relativistic Cyclotron Beta Particle Curvature', 'Stochastic Radioactive Decay Emission Engine'],
    },
    component: Experiment147WilsonCloudChamberTracks,
  },
  {
    meta: {
      id: '148',
      number: '148',
      title: 'Wheatstone Precision Bridge & Null Galvanometer',
      category: 'Physics & Geometry',
      tags: ['Wheatstone Bridge', 'Precision Metrology', 'Null Method', 'Taut-Band Galvanometer'],
      mechanismSignature: 'Four-Resistor Diamond Network (R1, R2, R3, Rx) -> DC Excitation -> Center-Branch Taut-Band Galvanometer -> Perfect Null Balance when Rx = (R2/R1)*R3',
      designSignature: 'Typography: Victorian Electrical Metrology Serif · Color: Diamond Copper Circuit & Center-Zero Vernier Dial · Composition: Precision Resistance Bridge Bench',
      description: '1843 Sir Charles Wheatstone bridge circuit measuring unknown electrical resistance to micro-ohm precision using the sensitive zero-deflection null balance method.',
      keyTechnologies: ['Wheatstone Bridge Potential Balance Equation', 'Taut-Band Galvanometer Mechanical Deflection', 'Decade Resistance Box Tuning Model'],
    },
    component: Experiment148WheatstoneBridgeNullGalvo,
  },
  {
    meta: {
      id: '149',
      number: '149',
      title: '3D Excitable Chemical Wave Toroidal Scroll Ring',
      category: 'Simulation',
      tags: ['Scroll Ring', 'BZ Reaction', 'Excitable Media', 'Vortex Singularity', '3D Wavefront'],
      mechanismSignature: '3D Excitable Medium Reaction-Diffusion -> 2D Spiral Wave Extends to 3D Vortex Filament -> Closes into Self-Sustaining Toroidal Scroll Ring with Phase Singularity',
      designSignature: 'Typography: Nonlinear Dynamics Sans · Color: Ferriin Blue & Ferroin Crimson Oxidation Wavefronts · Composition: 3D Toroidal Wave Geometry',
      description: 'Self-organizing 3D chemical turbulence: reaction-diffusion spiral waves closed into rotating, twisting toroidal scroll rings and vortex filaments.',
      keyTechnologies: ['Toroidal Wavefront Coordinate Geometry', 'Topological Helical Filament Twist Math', 'Volumetric Excitable Media Concentration Gradient'],
    },
    component: Experiment149BelousovZhabotinskyScrollRing,
  },
  {
    meta: {
      id: '150',
      number: '150',
      title: 'Antikythera Astronomical Saros & Exeligmos Calculator',
      category: 'Retro & Optics',
      tags: ['150th Milestone', 'Antikythera', 'Saros Eclipse', 'Ancient Computer', 'Masterpiece'],
      mechanismSignature: 'Bronze Differential Crown Wheel -> Epicyclic Anomaly Pin-and-Slot Geartrain -> 223-Month Archimedean Saros Spiral Dial & 54-Year Exeligmos Turn Subdial',
      designSignature: 'Typography: Ancient Hellenistic Bronze Serif · Color: Verdigris Patina, Corinthian Bronze, Gilded Inscriptions · Composition: Archimedean Spiral Eclipse Dial',
      description: 'The 150th Master Milestone: ancient Greece’s miraculous mechanical astronomical computer predicting solar and lunar eclipses with multi-turn spiral gears.',
      keyTechnologies: ['223-Synodic Month Saros Eclipse Mathematics', 'Archimedean 4-Turn Spiral Dial Tracking', 'Ancient Hellenistic Bronze Gearbox Simulation'],
    },
    component: Experiment150AntikytheraEclipsePredictor,
  },
  {
    meta: {
      id: '151',
      number: '151',
      title: 'Mach-Zehnder Optical Interferometer & Quantum Eraser',
      category: 'Retro & Optics',
      tags: ['Mach-Zehnder', 'Interferometry', 'Quantum Eraser', 'Beam Splitter', 'Phase Shift'],
      mechanismSignature: 'Coherent Laser Beam -> 50:50 Beam Splitter -> Dual Orthogonal Optical Paths with Adjustable Phase Delay -> Recombination Interference Fringe Detection',
      designSignature: 'Typography: Quantum Metrology Mono · Color: 532nm Emerald Laser, Dielectric Silver Mirrors · Composition: Precision Optical Breadboard Rig',
      description: 'Ludwig Mach and Ludwig Zehnder split-beam optical interferometer demonstrating wave interference, relative phase delays, and complementary detector dark fringes.',
      keyTechnologies: ['Optical Interference Wave Equations', 'Beam Splitter Matrix Math', 'Quantum Phase Modulation Simulation'],
    },
    component: Experiment151MachZehnderInterferometer,
  },
  {
    meta: {
      id: '152',
      number: '152',
      title: 'Francis Galton Quincunx Pegboard Normal Distribution',
      category: 'Physics & Geometry',
      tags: ['Galton Board', 'Central Limit Theorem', 'Binomial Distribution', 'Gaussian Bell Curve', 'Statistical Mechanics'],
      mechanismSignature: 'Spherical Shot Gravity Cascade -> Triangular Quincunx Pin Grid -> 50% Left/Right Deflection Probability -> Normal Gaussian Bin Accumulation',
      designSignature: 'Typography: Victorian Actuarial Serif · Color: Brass Pegs, Walnut Frame, Gilded Gaussian Bell Overlay · Composition: Vertical Gravity Drop Column',
      description: 'Sir Francis Galton’s 1889 bean machine physically visualizing the Central Limit Theorem and emergence of the Gaussian bell curve from random Bernoulli trials.',
      keyTechnologies: ['Bernoulli Trial Probability Cascade', 'Euler Integration Gravity Physics', 'Normal Distribution Curve Fitting'],
    },
    component: Experiment152GaltonBoardNormalDistribution,
  },
  {
    meta: {
      id: '153',
      number: '153',
      title: 'Double Compound Pendulum Chaos & Poincaré Section',
      category: 'Physics & Geometry',
      tags: ['Double Pendulum', 'Deterministic Chaos', 'Lyapunov Exponent', 'Poincaré Section', 'Lagrangian Mechanics'],
      mechanismSignature: 'Coupled Nonlinear Euler-Lagrange Equations -> High-Precision Runge-Kutta 4 Integrator -> Sensitive Initial Conditions -> Hyper-Chaotic Phase Space Orbit',
      designSignature: 'Typography: Dynamical Systems Sans · Color: Phosphor Trail Glow & Amber Joint Accents · Composition: Dual Linkage Arc & Phase Space Display',
      description: 'Classic deterministic chaos simulator with coupled nonlinear Lagrangian motion, extreme sensitivity to initial conditions, and dynamic Poincaré phase portraits.',
      keyTechnologies: ['Runge-Kutta 4th Order RK4 Integration', 'Coupled Lagrangian Equations of Motion', 'Phase Plane Trajectory Mapping'],
    },
    component: Experiment153DoublePendulumChaosPoincare,
  },
  {
    meta: {
      id: '154',
      number: '154',
      title: 'Kelvin-Helmholtz Hydrodynamic Shear Instability',
      category: 'Simulation',
      tags: ['Kelvin-Helmholtz', 'Fluid Dynamics', 'Vorticity Waves', 'Atmospheric Shear', 'Navier-Stokes'],
      mechanismSignature: 'Stratified Two-Fluid Interface -> Relative Velocity Shear Gradient -> Wave Perturbation Growth -> Non-Linear Billow Roll-Up and Vortex Sheet Formation',
      designSignature: 'Typography: Atmospheric Science Mono · Color: Cyan Tropospheric Billows & Deep Ocean Density Contours · Composition: Horizontal Flow Tunnel',
      description: 'Fluid dynamics simulation of Kelvin-Helmholtz shearing instability generating iconic breaking ocean waves and Jupiter-like atmospheric vortex billows.',
      keyTechnologies: ['Vortex Sheet Dynamics Model', 'Shear Perturbation Math', 'Density Stratification Rendering'],
    },
    component: Experiment154KelvinHelmholtzHydrodynamicInstability,
  },
  {
    meta: {
      id: '155',
      number: '155',
      title: 'Heinrich Barkhausen Ferromagnetic Domain Wall Avalanches',
      category: 'Physics & Geometry',
      tags: ['Barkhausen Effect', 'Ferromagnetism', 'Domain Walls', 'Acoustic Crackle', 'Magnetic Hysteresis'],
      mechanismSignature: 'External H-Field Ramp -> Domain Wall Pinning at Impurities -> Sudden Quantum Depinning Avalanches -> Microsecond Flux Jumps & Synthesized Audio Crackle',
      designSignature: 'Typography: Ferromagnetic Laboratory Sans · Color: Magnetite Black, Copper Solenoid Wire, Spikeline CRT Oscilloscope · Composition: Core Microstructure & Scope',
      description: '1919 Heinrich Barkhausen acoustic effect demonstrating discrete quantum-like domain wall depinning jumps within ferromagnetic iron under external magnetic bias.',
      keyTechnologies: ['Magnetic Domain Wall Pinning Model', 'Web Audio API Noise Synthesis', 'Hysteresis Loop Flux Step Accumulator'],
    },
    component: Experiment155BarkhausenMagneticDomainJumps,
  },
  {
    meta: {
      id: '156',
      number: '156',
      title: 'Yakir Aharonov & David Bohm Quantum Vector Potential Phase Shift',
      category: 'Physics & Geometry',
      tags: ['Aharonov-Bohm', 'Quantum Phase', 'Magnetic Vector Potential', 'Gauge Theory', 'Electron Diffraction'],
      mechanismSignature: 'Shielded Solenoid B-Field = 0 Outside -> Non-Zero Vector Potential A -> Complex Electron Wavefunction Phase Shift Δφ = (q/ħ)∮A·dr -> Spatial Fringe Shift',
      designSignature: 'Typography: Quantum Field Theory Sans · Color: Coherent Electron Cobalt & Solenoid Magnetic Flux Orange · Composition: Double-Path Beam Interference Chamber',
      description: 'Proof of the physical reality of electromagnetic vector potential in quantum mechanics where electron waves experience phase shift in regions of zero magnetic field.',
      keyTechnologies: ['Wavefunction Complex Phase Integration', 'Magnetic Vector Potential Field Line Shader', 'Interference Pattern Spectral Shift'],
    },
    component: Experiment156AharonovBohmPhaseShift,
  },
  {
    meta: {
      id: '157',
      number: '157',
      title: 'Leon Chua Autonomous Chaotic Attractor Circuit',
      category: 'Simulation',
      tags: ['Chua Circuit', 'Strange Attractor', 'Nonlinear Resistor', 'Double Scroll', 'Bifurcation'],
      mechanismSignature: 'Three Reactive Elements (L, C1, C2) + Piecewise-Linear Active Chua Diode -> Autonomous Third-Order Non-Linear ODEs -> Double-Scroll Chaotic Strange Attractor',
      designSignature: 'Typography: Electronic Engineering Mono · Color: Phosphor Green Vector Scope & Orange Trajectory Gradient · Composition: 3D Phase Space Projection',
      description: 'The simplest autonomous electronic circuit exhibiting chaos: Chua’s famous 1983 double-scroll strange attractor simulated via stiff numerical integration.',
      keyTechnologies: ['Piecewise-Linear Chua Diode Function', '3D Orthographic Phase Space Projection', 'Nonlinear Differential Equations'],
    },
    component: Experiment157ChuaChaoticCircuitAttractor,
  },
  {
    meta: {
      id: '158',
      number: '158',
      title: 'Heinrich Rubens Acoustic Standing Wave Flame Tube',
      category: 'Audio & Signals',
      tags: ['Rubens Tube', 'Acoustic Standing Waves', 'Flame Nodes', 'Pressure Antinodes', 'Resonance'],
      mechanismSignature: 'Acoustic Loudspeaker Pressure Waves -> Sealed Flammable Gas Pipe -> Standing Wave Interference -> Variable Burner Orifice Flame Heights at Nodes/Antinodes',
      designSignature: 'Typography: Vintage Acoustics Serif · Color: Combusting Hydrocarbon Blue-Orange Flame Tints & Brass Pipe Body · Composition: Longitudinal Cross-Section',
      description: '1905 Heinrich Rubens physics demonstration showing acoustic standing sound waves by modulating luminous gas flames along a perforated resonant cylinder.',
      keyTechnologies: ['Acoustic Standing Wave Pressure Formula', 'Kinetic Flame Particle Shader', 'Harmonic Resonance Frequency Tuning'],
    },
    component: Experiment158RubensAcousticFlameTube,
  },
  {
    meta: {
      id: '159',
      number: '159',
      title: 'Korteweg-De Vries Nonlinear Hydrodynamic Soliton Collision',
      category: 'Simulation',
      tags: ['Soliton', 'KdV Equation', 'Hydrodynamics', 'Nonlinear Wave', 'John Scott Russell'],
      mechanismSignature: 'KdV Equation (∂η/∂t + c∂η/∂x + αη∂η/∂x + β∂³η/∂x³ = 0) -> Balance of Nonlinear Steepening and Dispersion -> Elastic Solitary Wave Soliton Interaction',
      designSignature: 'Typography: Fluid Hydrodynamics Mono · Color: Shallow Water Aquamarine & Surface Curvature Highlights · Composition: Longitudinal Canal Elevation Profile',
      description: 'John Scott Russell’s 1834 great solitary wave of translation governed by the Korteweg–de Vries equation, exhibiting non-destructive collisions and stable propagation.',
      keyTechnologies: ['Korteweg–de Vries Spatial Difference Scheme', 'Soliton Dispersion Balance Physics', 'Interactive Surface Profile Plot'],
    },
    component: Experiment159KortewegDeVriesSolitonWave,
  },
  {
    meta: {
      id: '160',
      number: '160',
      title: 'John Henry Poynting Electromagnetic Energy Flux Vector',
      category: 'Physics & Geometry',
      tags: ['Poynting Vector', 'Electromagnetism', 'E x B Flux', 'Energy Conservation', 'Maxwell Equations'],
      mechanismSignature: 'Electric Vector E + Magnetic Vector B -> Cross Product Vector S = (1/μ₀)(E × B) -> Directional Energy Flux Streamlines in Coaxial & Free Space Fields',
      designSignature: 'Typography: Classical Electrodynamics Serif · Color: Electric Field Crimson, Magnetic Field Teal, Poynting Flux Gold · Composition: Orthogonal Vector Matrix',
      description: 'Dynamic visualization of electromagnetic energy transfer through space via the Poynting vector S = (E × B)/μ₀ in oscillating fields and transmission lines.',
      keyTechnologies: ['Vector Field 3D Cross Product Mathematics', 'Dynamic Fieldline Streamline Advection', 'Energy Density Contour Shader'],
    },
    component: Experiment160PoyntingVectorElectromagneticFlux,
  },
  {
    meta: {
      id: '161',
      number: '161',
      title: 'Cladistic Phylogenetic Tree & Molecular Branch Divergence',
      category: 'Simulation',
      tags: ['Phylogenetics', 'Cladogram', 'Taxonomy', 'Evolutionary Biology', 'Tree of Life'],
      mechanismSignature: 'Evolutionary Distance Matrix -> Hierarchical Clustering Algorithm -> Calibrated Node Branch Lengths -> Radial and Rectangular Cladogram Morphometrics',
      designSignature: 'Typography: Linnaean Botanical Serif · Color: Parchment Sepia & Leaf Green Clade Highlights · Composition: Bifurcating Evolutionary Dendrogram',
      description: 'Computational phylogenetics engine rendering evolutionary branching trees, clade bifurcations, and molecular clock divergence timelines.',
      keyTechnologies: ['Hierarchical Tree Traversal Layout', 'Distance Matrix Clustal Optimization', 'Radial Coordinate Dendrogram Projections'],
    },
    component: Experiment161CladogramPhylogeneticTree,
  },
  {
    meta: {
      id: '162',
      number: '162',
      title: 'Thomas Johann Seebeck Thermoelectric Couple Electromotive Force',
      category: 'Physics & Geometry',
      tags: ['Seebeck Effect', 'Thermoelectricity', 'Thermocouple', 'Peltier Counterpart', 'Solid State Physics'],
      mechanismSignature: 'Thermal Gradient ΔT Between Bimetallic Junctions -> Charge Carrier Diffusion Pressure -> Induced Seebeck Voltage V = S·ΔT -> Closed-Circuit Deflection',
      designSignature: 'Typography: Thermodynamics Laboratory Sans · Color: Hot Junction Crimson, Cold Junction Ice Blue, Copper Conductor Lustre · Composition: Thermoelectric Circuit Loop',
      description: '1821 Thomas Johann Seebeck thermoelectric phenomenon converting thermal temperature differentials directly into electrical electromotive force and galvanometer deflection.',
      keyTechnologies: ['Seebeck Voltage Calculation', 'Carrier Thermal Diffusion Drift Model', 'Microvolt Galvanometer Dial Simulation'],
    },
    component: Experiment162SeebeckThermoelectricEMF,
  },
  {
    meta: {
      id: '163',
      number: '163',
      title: 'Jean Léonard Marie Poiseuille Laminar Viscous Pipe Flow',
      category: 'Simulation',
      tags: ['Poiseuille Flow', 'Laminar Fluid', 'Viscosity', 'Parabolic Velocity Profile', 'Hydrodynamics'],
      mechanismSignature: 'Hagen-Poiseuille Differential Navier-Stokes -> Cylindrical Boundary No-Slip Condition -> Parabolic Velocity Profile v(r) = (ΔP/4μL)(R² - r²) -> Tracer Shear Tracking',
      designSignature: 'Typography: Fluid Dynamics Technical Mono · Color: Streamline Viscous Amber & Glass Tube Reflections · Composition: Axial Pipe Cutaway',
      description: 'Poiseuille laminar fluid flow through cylindrical pipes demonstrating viscous drag, no-slip wall boundary conditions, and quartic fourth-power radius flow scaling.',
      keyTechnologies: ['Poiseuille Velocity Field Equation', 'Lagrangian Fluid Particle Tracking', 'Boundary Layer Shear Stress Computation'],
    },
    component: Experiment163PoiseuilleLaminarFluidPipe,
  },
  {
    meta: {
      id: '164',
      number: '164',
      title: 'Isidor Isaac Rabi Quantum Two-Level Rabi Flopping',
      category: 'Physics & Geometry',
      tags: ['Rabi Oscillation', 'Bloch Sphere', 'Quantum Two-Level', 'Atomic Physics', 'NMR / MRI'],
      mechanismSignature: 'Two-Level Quantum Hamiltonian + Periodic EM Perturbation -> Time-Dependent Schrödinger State Vector Rotation on Bloch Sphere -> Sinusoidal State Inversion',
      designSignature: 'Typography: Quantum Mechanics Sans · Color: Coherent Purple & Bloch Sphere Polar Guides · Composition: 3D Bloch Vector Sphere & Probability Trace',
      description: 'Isidor Isaac Rabi’s foundational atomic quantum resonance: cyclical transitions of a two-level system under resonant oscillating fields visualized on the Bloch sphere.',
      keyTechnologies: ['Bloch Sphere 3D Vector Math', 'Time-Dependent State Probability Integration', 'Rabi Flopping Frequency Formula'],
    },
    component: Experiment164RabiQuantumOscillations,
  },
  {
    meta: {
      id: '165',
      number: '165',
      title: 'Christopher Langton Cellular Automaton Turing Ant',
      category: 'Simulation',
      tags: ['Langton Ant', 'Cellular Automata', 'Emergence', 'Turing Completeness', 'Highway Formation'],
      mechanismSignature: 'Discrete 2D Grid Cells + Simple Turning Rules (White: Turn 90° R, Flip Black; Black: Turn 90° L, Flip White) -> Chaotic Wandering -> 10,000-Step Highway Emergence',
      designSignature: 'Typography: Theoretical Computing Mono · Color: Monochromatic High-Contrast Ink & Crimson Ant Pointer · Composition: Infinite Toroidal Lattice Grid',
      description: 'Christopher Langton’s 1986 two-dimensional Turing machine demonstrating how two trivial local rules produce apparent disorder before spontaneously building a repeating highway.',
      keyTechnologies: ['2D Bitmapped Cell State Grid', 'Langton Ant Finite State Automaton', 'High-Speed Stepper Cycle Loop'],
    },
    component: Experiment165LangtonsAntCellularTuring,
  },
  {
    meta: {
      id: '166',
      number: '166',
      title: 'Joseph von Fraunhofer Optical Wavefront Multi-Slit Diffraction',
      category: 'Retro & Optics',
      tags: ['Fraunhofer Diffraction', 'Diffraction Grating', 'Sinc Function', 'Fourier Optics', 'Spectral Dispersion'],
      mechanismSignature: 'Monochromatic Plane Wave Illumination -> Aperture Transmission Array -> Huygens-Fresnel Fourier Far-Field Transform -> Multi-Beam Sinc² Intensity Pattern',
      designSignature: 'Typography: Classical Physical Optics Serif · Color: Spectral Dispersion Rainbow & Monochromatic Laser Fringe Scales · Composition: Slit Aperture & Detector Screen',
      description: 'Far-field Fraunhofer optical diffraction from single, double, and periodic multi-slit gratings with real-time wavelength and aperture geometry modulation.',
      keyTechnologies: ['Fraunhofer Fourier Transform Optics', 'Huygens Wavefront Superposition', 'Intensity Distribution Curve Grapher'],
    },
    component: Experiment166FraunhoferDiffractionSlits,
  },
  {
    meta: {
      id: '167',
      number: '167',
      title: 'Geodesic Hyperbolic Poincaré Disc Tessellation',
      category: 'Physics & Geometry',
      tags: ['Hyperbolic Geometry', 'Poincaré Disc', 'Escher Circle Limit', 'Non-Euclidean', 'Möbius Transforms'],
      mechanismSignature: 'Poincaré Disk Conformal Model -> Hyperbolic Geodesic Circular Arcs -> Non-Euclidean Polygon Tessellation {p, q} -> Real-Time Möbius Automorphism Navigation',
      designSignature: 'Typography: Non-Euclidean Mathematical Serif · Color: Archival Ivory & Indigo Geodesic Tiling Edges · Composition: Conformal Unit Disk Rim',
      description: 'Interactive non-Euclidean hyperbolic space tessellations based on the Poincaré conformal disk projection, featuring dynamic Möbius transformations and Escher-style tilings.',
      keyTechnologies: ['Poincaré Disk Coordinate Transformations', 'Möbius Hyperbolic Isometry Equations', 'Recursive Polygon Tiling Subdivider'],
    },
    component: Experiment167GeodesicHyperbolicTessellation,
  },
  {
    meta: {
      id: '168',
      number: '168',
      title: 'William Lawrence Bragg Specular X-Ray Crystal Diffraction',
      category: 'Physics & Geometry',
      tags: ['Bragg Law', 'Crystallography', 'X-Ray Diffraction', 'Atomic Planes', 'Constructive Interference'],
      mechanismSignature: 'Incident Coherent X-Ray Wavefront -> Crystal Atomic Lattice Planes (d-spacing) -> Specular Reflections with Path Difference 2d sin θ = nλ -> Constructive Peak Detection',
      designSignature: 'Typography: Crystallography Laboratory Sans · Color: Cobalt Crystal Lattice & Emerald X-Ray Wavefront Beams · Composition: Atomic Plane Cross-Section & Peak Meter',
      description: 'Sir William Lawrence Bragg’s 1913 Nobel-prize winning law: determining atomic crystal lattice structures through constructive interference of scattered X-ray waves.',
      keyTechnologies: ['Bragg Interference Path Difference Formula', 'Periodic Crystal Lattice Coordinate Math', 'Real-Time Constructive Peak Detector'],
    },
    component: Experiment168BraggXRayCrystalDiffraction,
  },
  {
    meta: {
      id: '169',
      number: '169',
      title: 'Theodore von Kármán Vortex Street Alternate Shedding',
      category: 'Simulation',
      tags: ['Von Kármán', 'Vortex Shedding', 'Bluff Body', 'Fluid Strouhal', 'Wake Instability'],
      mechanismSignature: 'Uniform Fluid Inflow Past Cylindrical Bluff Body -> Boundary Layer Separation -> Alternate Negative/Positive Vortex Core Detachment -> Staggered Periodic Vortex Wake',
      designSignature: 'Typography: Aero-Hydrodynamics Technical Mono · Color: Streamline Cyan & Vorticity Curl Bicolor Markers · Composition: Wind/Water Channel Flow Field',
      description: 'The celebrated periodic wake of alternating vortices shed behind a cylindrical obstacle in a fluid stream, responsible for singing wires and suspension bridge oscillations.',
      keyTechnologies: ['Point Vortex Particle Advection', 'Biot-Savart Induced Flow Influence', 'Strouhal Frequency Scaling Model'],
    },
    component: Experiment169NavierStokesVortexSheddingVonKarman,
  },
  {
    meta: {
      id: '170',
      number: '170',
      title: 'Tycho Brahe Geocentric-Heliocentric Planetary Epicycles',
      category: 'Retro & Optics',
      tags: ['Tychonic System', 'Planetary Orbits', 'Epicycles', 'History of Astronomy', 'Retrograde Motion'],
      mechanismSignature: 'Stationary Earth Center -> Sun Orbits Earth -> Moon Orbits Earth -> Mercury, Venus, Mars, Jupiter, Saturn Orbit Moving Sun -> Elegant Interlocking Epicycloidal Spirograms',
      designSignature: 'Typography: 16th-Century Uraniborg Astrological Serif · Color: Gilded Brass Astronomical Rings & Midnight Celestial Azure · Composition: Armillary Sphere Planetary Tracker',
      description: 'Tycho Brahe’s 1588 geo-heliocentric cosmological model bridging Ptolemaic and Copernican views, generating exquisite geometric spirograms of planetary motion.',
      keyTechnologies: ['Tychonic Coordinate Kinematics', 'Orbital Eccentricity Equations', 'Historical Epicycloid Curve Accumulator'],
    },
    component: Experiment170TychonicPlanetaryEpicycles,
  },
  {
    meta: {
      id: '171',
      number: '171',
      title: 'Rotating Quantized Superfluid Vortex Triangular Abrikosov Lattice',
      category: 'Physics & Geometry',
      tags: ['Superfluidity', 'Bose-Einstein', 'Quantized Vortices', 'Abrikosov Lattice', 'Quantum Circulation'],
      mechanismSignature: 'Zero-Viscosity Superfluid Condensate Under Rotation -> Circulation Quantization ∮v·dr = n(h/m) -> Mutual Vortex Core Repulsion -> Spontaneous Triangular Lattice Assembly',
      designSignature: 'Typography: Low-Temperature Quantum Physics Mono · Color: Liquid Helium Azure & Golden Vortex Singularities · Composition: Rotating Cylindrical Cryostat Vessel',
      description: 'Quantized vortex lines in rotating superfluid liquid Helium-4 and Bose-Einstein condensates spontaneously self-organizing into regular triangular Abrikosov lattices.',
      keyTechnologies: ['Quantized Circulation Biot-Savart Velocity Sum', 'Inter-Vortex Repulsive Potential Relaxation', 'Cryogenic Cryostat Vessel Rendering'],
    },
    component: Experiment171SuperfluidVortexLattice,
  },
  {
    meta: {
      id: '172',
      number: '172',
      title: 'Daniel Bernoulli Venturi Throat Pressure Differential & Vacuum Lift',
      category: 'Physics & Geometry',
      tags: ['Bernoulli Principle', 'Venturi Effect', 'Continuity Equation', 'Fluid Pressure', 'Aerodynamic Lift'],
      mechanismSignature: 'Incompressible Fluid Entering Constricted Throat -> Mass Continuity Demands Velocity Acceleration -> Static Pressure Drops (P + ½ρv² = const) -> Liquid Manometer Suction',
      designSignature: 'Typography: Classical Hydrodynamics Sans · Color: Flow Streamline Teal, Manometer Glass Columns, Red Indicator Fluid · Composition: Venturi Tube Longitudinal Cutaway',
      description: '1738 Daniel Bernoulli principle and Giovanni Venturi meter demonstrating that fluid acceleration through a constriction causes a localized static pressure drop and suction.',
      keyTechnologies: ['Bernoulli Energy Invariant Equation', 'Continuity Conservation Law', 'Dynamic Fluid Column Manometer Model'],
    },
    component: Experiment172BernoulliVenturiVacuumLift,
  },
  {
    meta: {
      id: '173',
      number: '173',
      title: 'Max Planck Blackbody Spectral Radiance & Ultraviolet Limit',
      category: 'Physics & Geometry',
      tags: ['Planck Law', 'Blackbody Radiation', 'Quantum Revolution', 'Wien Displacement', 'Spectral Curves'],
      mechanismSignature: 'Cavity Radiation Equilibrium -> Quantum Resonator Energy E = nhν -> Planck Distribution B(λ, T) = (2hc²/λ⁵)/(exp(hc/λkBT) - 1) -> Peak Shift with Temperature',
      designSignature: 'Typography: Quantum Revolution Serif · Color: Incandescent Color Temperature Gradient & Black Radiance Chart · Composition: Planck Spectral Curve Overlay',
      description: 'Max Planck’s 1900 quantum hypothesis resolving the ultraviolet catastrophe by modeling cavity thermal radiation as discrete quantized energy packets.',
      keyTechnologies: ['Planck Radiation Formula Integration', 'Wien Displacement Peak Calculation', 'CIE Color Temperature Chromaticity Conversion'],
    },
    component: Experiment173BlackbodyPlanckRadiationLaw,
  },
  {
    meta: {
      id: '174',
      number: '174',
      title: 'Heinrich Lenz Magnetic Induction Eddy Current Retardation Braking',
      category: 'Physics & Geometry',
      tags: ['Lenz Law', 'Faraday Induction', 'Eddy Currents', 'Magnetic Braking', 'Electromagnetism'],
      mechanismSignature: 'Conductive Non-Magnetic Metal Plate Entering Magnetic Gap -> Induced Faraday EMF -> Circulating Eddy Currents Generate Counter-Magnetic Field -> Smooth Viscous Braking Force',
      designSignature: 'Typography: Electromechanical Physics Sans · Color: Copper Plate Lustre, Polepiece Neodymium Cobalt, Blue Eddy Current Spirals · Composition: Pendulum / Linear Track Bench',
      description: 'Heinrich Lenz’s 1834 fundamental law of induction showing how swirling eddy currents in moving conductors generate opposing magnetic fields, acting as frictionless electromagnetic brakes.',
      keyTechnologies: ['Faraday-Lenz Differential Induction Formula', 'Eddy Current Vector Streamlines', 'Viscous Electromagnetic Drag Simulator'],
    },
    component: Experiment174LenzEddyCurrentBraking,
  },
  {
    meta: {
      id: '175',
      number: '175',
      title: 'Willem Malkus & Edward Lorenz Chaotic Waterwheel Convection Analogy',
      category: 'Simulation',
      tags: ['Lorenz Waterwheel', 'Malkus Wheel', 'Atmospheric Chaos', 'Strange Attractor', 'Nonlinear Damping'],
      mechanismSignature: 'Top Water Stream Inflow -> Leaky Circumferential Buckets -> Gravitational Overturn vs Friction Retardation -> Spontaneous Reversals & Chaotic Phase Space Attractor',
      designSignature: 'Typography: Atmospheric Dynamics Technical Mono · Color: Stream Water Cerulean & Gilded Wheel Spoke Pivot · Composition: Rotating Symmetrical Wheel & Phase Angle Trace',
      description: 'Willem Malkus’s mechanical laboratory realization of Edward Lorenz’s famous 1963 atmospheric convection equations: a waterwheel that spontaneously oscillates and reverses chaotically.',
      keyTechnologies: ['Coupled Torque Differential Integration', 'Bucket Mass Inflow/Leaking Equations', 'Angular Velocity Phase Space Plotter'],
    },
    component: Experiment175LorenzWaterWheelChaoticDynamics,
  },
  {
    meta: {
      id: '176',
      number: '176',
      title: 'Robert Millikan Photoelectric Effect & Planck Constant Work Function',
      category: 'Physics & Geometry',
      tags: ['Photoelectric Effect', 'Einstein Nobel', 'Work Function', 'Stopping Voltage', 'Planck Constant'],
      mechanismSignature: 'Incident Monochromatic UV Photon hν -> Metal Cathode Electron Ejection -> Stopping Voltage Retardation V_stop = (h/e)ν - Φ/e -> Linear Stopping Potential Slope',
      designSignature: 'Typography: Early Quantum Physics Serif · Color: Photoelectron Ultraviolet Cobalt, Gold Leaf Anode, High-Voltage Amber · Composition: Phototube Vacuum Cell & Linear Slope Graph',
      description: 'Albert Einstein and Robert Millikan’s Nobel-winning discovery proving light quantization: electron ejection kinetic energy depends solely on photon frequency, not intensity.',
      keyTechnologies: ['Einstein Photoelectric Energy Conservation', 'Stopping Potential Retardation Calculation', 'Work Function Threshold Frequency Chart'],
    },
    component: Experiment176PhotoelectricWorkFunctionMillikan,
  },
  {
    meta: {
      id: '177',
      number: '177',
      title: 'Rayleigh-Jeans Classical Ultraviolet Radiation Catastrophe',
      category: 'Physics & Geometry',
      tags: ['UV Catastrophe', 'Rayleigh-Jeans', 'Equipartition', 'Blackbody Divergence', 'Classical Failure'],
      mechanismSignature: 'Classical Equipartition Theorem kT Per Cavity Mode -> Rayleigh-Jeans Density u(ν) ∝ ν² -> Asymptotic Ultraviolet Infinity Divergence vs Planck Physical Quantum Convergence',
      designSignature: 'Typography: Classical Mechanics Failure Serif · Color: Infrared Warmth Crimson to Catastrophic Ultraviolet Violet Gradient · Composition: Dual Curve Divergence Chart',
      description: 'The monumental failure of classical electrodynamics predicting infinite radiated power at high frequencies, which necessitated Max Planck’s quantum revolution.',
      keyTechnologies: ['Rayleigh-Jeans Asymptotic Equation', 'Planck Quantum Mode Density Contrast', 'Logarithmic Radiance Comparison Grapher'],
    },
    component: Experiment177RayleighJeansUltravioletCatastrophe,
  },
  {
    meta: {
      id: '178',
      number: '178',
      title: 'Lichtenberg High-Voltage Dielectric Surface Tree Breakdown',
      category: 'Physics & Geometry',
      tags: ['Lichtenberg Figures', 'Dielectric Breakdown', 'High Voltage', 'Electron Avalanches', 'Fractal Discharge'],
      mechanismSignature: 'Electron Beam Charged Polymethyl Methacrylate -> Pointed Grounded Electrode Tap -> Explosive Electric Discharge Avalanches -> Branching Fractal Dendritic Trapping Channels',
      designSignature: 'Typography: High-Voltage Physics Mono · Color: Electric Arc Cyan-White & Trapped Internal Lucite Glow · Composition: 2D/3D Dielectric Acrylic Slab',
      description: '1777 Georg Christoph Lichtenberg fractal electric discharge patterns created by catastrophic dielectric breakdown of electron-charged insulating polymers.',
      keyTechnologies: ['Dielectric Breakdown Model (DBM)', 'Laplacian Electric Potential Relaxation', 'Fractal Dendritic Arborization Rendering'],
    },
    component: Experiment178LichtenbergSurfaceDischargeTrees,
  },
  {
    meta: {
      id: '179',
      number: '179',
      title: 'Taylor-Couette Hydrodynamic Rotating Annular Cylinder Vortices',
      category: 'Simulation',
      tags: ['Taylor-Couette', 'Taylor Vortices', 'Centrifugal Instability', 'Hydrodynamics', 'Annular Flow'],
      mechanismSignature: 'Fluid Confined Between Coaxial Cylinders -> Inner Cylinder Rotational Speed Exceeds Critical Taylor Number Ta_c -> Centrifugal Instability -> Toroidal Vortex Cell Stacks',
      designSignature: 'Typography: Hydrodynamic Stability Sans · Color: Annular Liquid Steel Blue & Toroidal Vorticity Streamlines · Composition: Cross-Sectional Annulus Column',
      description: 'Geoffrey Ingram Taylor’s 1923 benchmark hydrodynamic instability: pure azimuthal shear flow abruptly breaking into alternating toroidal vortex rolls.',
      keyTechnologies: ['Taylor Number Stability Criteria', 'Annular Streamfunction Calculation', 'Toroidal Vortex Lagrangian Particle System'],
    },
    component: Experiment179TaylorCouetteVortexInstability,
  },
  {
    meta: {
      id: '180',
      number: '180',
      title: 'Ernest Rutherford Coulomb Nuclear Alpha Backscattering',
      category: 'Physics & Geometry',
      tags: ['Rutherford Scattering', 'Atomic Nucleus', 'Coulomb Force', 'Geiger-Marsden', 'Gold Foil'],
      mechanismSignature: 'Energetic Alpha Particles (He²⁺) -> Ultra-Thin Gold Foil Heavy Nuclei (Au⁷⁹⁺) -> Inverse-Square Coulomb Repulsion -> Rare Large-Angle and 180° Backscattering Trajectories',
      designSignature: 'Typography: Cambridge Cavendish Laboratory Serif · Color: Alpha Track Neon Green, Heavy Gold Nucleus Amber, Scintillation Screen Glow · Composition: Central Nucleus & Trajectory Fan',
      description: '1911 Ernest Rutherford, Hans Geiger, and Ernest Marsden gold foil experiment discovering the dense atomic nucleus via anomalous large-angle alpha backscattering.',
      keyTechnologies: ['Coulomb Repulsion Force Integration', 'Hyperbolic Orbit Impact Parameter Math', 'Scintillation Flashes Statistical Counter'],
    },
    component: Experiment180CoulombScatteringRutherfordNucleus,
  },
  {
    meta: {
      id: '181',
      number: '181',
      title: 'Arthur Compton Inelastic Relativistic Photon Wavelength Shift',
      category: 'Physics & Geometry',
      tags: ['Compton Scattering', 'Photon Momentum', 'Relativistic Collisions', 'Wavelength Shift', 'X-Ray Physics'],
      mechanismSignature: 'Incident X-Ray Photon + Free Target Electron at Rest -> Relativistic Energy-Momentum Collision -> Photon Scattered at Angle θ with Shifted Wavelength λ\' - λ = (h/m_e c)(1 - cos θ)',
      designSignature: 'Typography: Relativistic Quantum Physics Serif · Color: Incident X-Ray Cobalt, Scattered Recoil Amber, Target Electron Azure · Composition: Relativistic Collision Vector Diagram',
      description: 'Arthur Holly Compton’s 1923 Nobel-winning experiment proving photons carry discrete relativistic momentum p = h/λ through inelastic collisions with stationary electrons.',
      keyTechnologies: ['Compton Wavelength Shift Formula', 'Relativistic Four-Momentum Conservation', 'Recoil Electron Angle-Energy Computation'],
    },
    component: Experiment181ComptonPhotonWavelengthShift,
  },
  {
    meta: {
      id: '182',
      number: '182',
      title: 'Wiedemann-Franz Law Electronic & Thermal Conductivity Ratio',
      category: 'Physics & Geometry',
      tags: ['Wiedemann-Franz', 'Lorenz Number', 'Thermal Conductivity', 'Electrical Conductivity', 'Fermi Gas'],
      mechanismSignature: 'Free Conduction Electron Drift -> Simultaneous Charge & Heat Transport -> Universal Ratio K / (σ T) = L = (π² / 3)(k_B / e)² -> Constant Lorenz Number for Metals',
      designSignature: 'Typography: Solid State Physics Sans · Color: Thermal Gradient Flame Red to Ice Blue & Drude Electron Sea Silver · Composition: Conductor Micro-Bridge with Meter Scales',
      description: '1853 Gustav Wiedemann and Rudolf Franz fundamental solid-state law linking the ratio of thermal and electrical conductivity in metals to a universal physical constant.',
      keyTechnologies: ['Drude-Sommerfeld Electron Gas Model', 'Lorenz Ratio Theoretical Formulation', 'Coupled Fourier Heat & Ohm Charge Simulation'],
    },
    component: Experiment182WiedemannFranzThermalConductivity,
  },
  {
    meta: {
      id: '183',
      number: '183',
      title: 'Evjen & Madelung Crystal Ionic Electrostatic Lattice Energy',
      category: 'Physics & Geometry',
      tags: ['Madelung Constant', 'Crystal Lattice', 'Ionic Bonding', 'Rock Salt NaCl', 'Electrostatic Sum'],
      mechanismSignature: 'Alternating Cation (Na⁺) & Anion (Cl⁻) 3D Grid -> Infinite Coulomb Alternating Series Sum -> Evjen Neutral Shell Partial Summation -> Convergence to Madelung Constant M ≈ 1.74756',
      designSignature: 'Typography: Theoretical Crystallography Mono · Color: Sodium Cation Violet, Chlorine Anion Emerald, Electrostatic Field Lines · Composition: 3D Unit Cell & Sum Convergence Curve',
      description: 'Erwin Madelung’s 1918 calculation of the net electrostatic attractive binding energy of ionic crystals using conditionally convergent lattice Coulomb summations.',
      keyTechnologies: ['3D Ionic Lattice Coordinate Generator', 'Evjen Fractional Neutral-Shell Sum Algorithm', 'Real-Time Madelung Constant Convergence Graph'],
    },
    component: Experiment183MadelungCrystalLatticeEnergy,
  },
  {
    meta: {
      id: '184',
      number: '184',
      title: 'Plateau-Rayleigh Capillary Fluid Jet Pinch-Off & Satellite Drops',
      category: 'Simulation',
      tags: ['Plateau-Rayleigh', 'Capillary Pinch-Off', 'Surface Tension', 'Jet Instability', 'Satellite Droplets'],
      mechanismSignature: 'Falling Liquid Cylindrical Jet -> Capillary Pressure Perturbations -> Surface Area Minimization Drive -> Necking Pinch-Off -> Primary & Microscopic Satellite Droplet Formation',
      designSignature: 'Typography: Interfacial Fluid Dynamics Mono · Color: High-Speed Strobe Water Cerulean & Capillary Meniscus Highlights · Composition: Vertical Capillary Stream Tube',
      description: 'Joseph Plateau and Lord Rayleigh’s analysis of capillary fluid jets breaking up into spherical droplets driven by surface tension minimization of cylindrical surface area.',
      keyTechnologies: ['Capillary Wave Dispersion Relation', 'Nonlinear Necking Pinch-Off Math', 'Satellite Droplet Mass Conservation'],
    },
    component: Experiment184PlateauRayleighCapillaryDropletPinch,
  },
  {
    meta: {
      id: '185',
      number: '185',
      title: 'Pierre Curie & Pierre Weiss Ferromagnetic Second-Order Phase Transition',
      category: 'Physics & Geometry',
      tags: ['Curie-Weiss', 'Phase Transition', 'Spontaneous Magnetization', 'Critical Exponents', 'Ising Model'],
      mechanismSignature: 'Lattice Spin Coupling J -> Spontaneous Alignment Below Curie Temperature T_c -> Thermal Fluctuations Exceed Exchange Energy -> Paramagnetic Phase Transition with Susceptibility χ ∝ 1/(T - T_c)',
      designSignature: 'Typography: Condensed Matter Physics Serif · Color: Magnetic Dipole Alignment Crimson/Teal & Critical Temperature Thermal Glow · Composition: Spin Matrix Grid & M(T) Phase Curve',
      description: 'Pierre Curie and Pierre Weiss’s description of the sharp second-order magnetic phase transition where spontaneous magnetization vanishes above the Curie temperature.',
      keyTechnologies: ['Curie-Weiss Mean Field Equation', 'Monte Carlo Spin Lattice Metropolis Step', 'Order Parameter vs Temperature Grapher'],
    },
    component: Experiment185CurieWeissFerromagneticTransition,
  },
  {
    meta: {
      id: '186',
      number: '186',
      title: 'Michael Faraday Magneto-Optical Polarization Rotation',
      category: 'Retro & Optics',
      tags: ['Faraday Effect', 'Magneto-Optics', 'Polarization Rotation', 'Verdet Constant', 'Non-Reciprocal Optics'],
      mechanismSignature: 'Linearly Polarized Light Beams -> Dense Diamagnetic Medium Under Longitudinal B-Field -> Circular Birefringence (n_R ≠ n_L) -> Net Polarization Plane Rotation θ = V·B·L',
      designSignature: 'Typography: 19th-Century Royal Institution Serif · Color: Polarized Vector Gold, Magnet Solenoid Bronze, Transmitted Spectrum Cobalt · Composition: Optical Bench with Crossed Nicol Prisms',
      description: '1845 Michael Faraday discovery linking light and electromagnetism: non-reciprocal rotation of the plane of polarization when light travels through a magnetized medium.',
      keyTechnologies: ['Verdet Circular Birefringence Model', 'Polarization Vector Dynamic Animation', 'Nicol Analyzer Extinction Ratio Calculation'],
    },
    component: Experiment186FaradayMagneticPolarizationRotation,
  },
  {
    meta: {
      id: '187',
      number: '187',
      title: 'Acoustic Cavitation Bubble Collapse & Sonoluminescence Flash',
      category: 'Physics & Geometry',
      tags: ['Sonoluminescence', 'Acoustic Cavitation', 'Bubble Collapse', 'Extreme Thermodynamics', 'Picosecond Light Flash'],
      mechanismSignature: 'Ultrasonic Acoustic Standing Wave Traps Gas Micro-Bubble -> Rayleigh-Plesset Radial Expansion -> Relativistic Inward Inertial Collapse -> Extreme Adiabatic Core Heating (>10,000K) -> Picosecond UV Flash',
      designSignature: 'Typography: Extreme Acoustics Laboratory Sans · Color: Acoustic Levitation Blue, Shockwave Compressive Rings, Incandescent Luminescent White-Flash · Composition: Resonant Cavity Cell & R(t) Radius Trace',
      description: 'Single-bubble sonoluminescence: converting acoustic sound waves into radiant light through the violent, spherically symmetric collapse of a cavitating gas micro-bubble.',
      keyTechnologies: ['Rayleigh-Plesset Differential Bubble Dynamics', 'Adiabatic Compression Plasma Temperature Model', 'Picosecond Photoluminescence Flash Shader'],
    },
    component: Experiment187CavitationSonoluminescenceFlash,
  },
  {
    meta: {
      id: '188',
      number: '188',
      title: 'Alan Turing & Misra-Sudarshan Quantum Zeno Measurement Freeze',
      category: 'Physics & Geometry',
      tags: ['Quantum Zeno Effect', 'Wavefunction Collapse', 'Projective Measurement', 'Decoherence', 'Turing Paradox'],
      mechanismSignature: 'Unperturbed Quantum State Transitions with Quadratic Early-Time Survival P(t) ≈ 1 - (t/τ)² -> Frequent Rapid Projective Measurements at Interval Δt -> State Evolution Completely Suppressed/Frozen',
      designSignature: 'Typography: Foundational Quantum Foundations Sans · Color: Unperturbed Transition Curve Cerulean & Pulsed Strobe Flash Gold · Composition: Wavefunction Probability Clock & Measurement Gate',
      description: 'The Quantum Zeno effect (or Turing paradox): frequent repeated observation of an unstable quantum system completely suppresses and freezes its spontaneous transition.',
      keyTechnologies: ['Von Neumann Projective Collapse Math', 'Quadratic Transition Survival Integration', 'Measurement Frequency Duty-Cycle Control'],
    },
    component: Experiment188ZenoQuantumMeasurementFreeze,
  },
  {
    meta: {
      id: '189',
      number: '189',
      title: 'Bose-Einstein Condensation Momentum Bimodal Velocity Peak',
      category: 'Physics & Geometry',
      tags: ['Bose-Einstein Condensate', 'BEC', 'Quantum Degeneracy', 'Laser Cooling', 'Time-of-Flight'],
      mechanismSignature: 'Bosonic Gas Vapor Laser-Cooled Below Critical Temperature T_c -> Thermal De Broglie Wavelength Exceeds Interparticle Spacing -> Spontaneous Ground State Condensation -> Sharp Central Velocity Peak',
      designSignature: 'Typography: Cryogenic Atomic Physics Mono · Color: False-Color Absorption Profile (Blue to Red to Intense White Peak) · Composition: 3D Time-of-Flight Velocity Distribution Surface',
      description: '1995 Cornell-Wieman-Ketterle discovery of Bose-Einstein condensation visualized through false-color absorption images showing a dramatic narrow peak in momentum space.',
      keyTechnologies: ['Bose-Einstein Statistical Distribution', 'Time-of-Flight (TOF) Ballistic Expansion Model', 'Bimodal Thermal + Condensate Density Fitting'],
    },
    component: Experiment189BoseEinsteinCondensateVelocityDistribution,
  },
  {
    meta: {
      id: '190',
      number: '190',
      title: 'Joseph Larmor Magnetic Moment Precession & NMR Resonance',
      category: 'Physics & Geometry',
      tags: ['Larmor Precession', 'Nuclear Magnetic Resonance', 'Gyromagnetic Ratio', 'Spin Dynamics', 'MRI Physics'],
      mechanismSignature: 'Nuclear Magnetic Dipole μ in Static Magnetic Field B₀ -> Torque τ = μ × B₀ -> Precession Around Axis at Larmor Frequency ω_L = γ·B₀ -> Resonant RF Nutation Flip',
      designSignature: 'Typography: Magnetic Resonance Metrology Sans · Color: Static B0 Field Violet, Precessing Vector Orange, RF Nutation Pulse Teal · Composition: 3D Spin Gyro Vector & Frequency Resonance Peak',
      description: 'Joseph Larmor’s 1897 precession theorem forming the basis of Modern NMR spectroscopy and Magnetic Resonance Imaging (MRI), demonstrating spin precession in external fields.',
      keyTechnologies: ['Bloch Phenomenological Spin Precession ODEs', 'Larmor Frequency Gyromagnetic Scaling', '3D Spin Nutation Frame of Reference'],
    },
    component: Experiment190LarmorPrecessionMagneticMoment,
  },
  {
    meta: {
      id: '191',
      number: '191',
      title: 'William Hewlett Wien Bridge Audio Oscillator & Incandescent Bulb',
      category: 'Audio & Signals',
      tags: ['Wien Bridge', 'Hewlett-Packard', 'Audio Oscillator', 'Nonlinear Bulb', 'Ultra-Low Distortion'],
      mechanismSignature: 'RC Bandpass / Notch Frequency-Selective Network -> Positive Feedback Loop Barkhausen Criterion A·β = 1 -> Tungsten Filament Bulb Acts as Thermal Non-Linear Amplitude Stabilizer -> Pure Sine Tone',
      designSignature: 'Typography: 1939 Palo Alto Electronics Serif · Color: Bakelite Brown, Amber Vacuum Glow, Phosphor Green CRT Trace · Composition: Dual-Ganged Tuning Dial & Audio Scope',
      description: 'William Hewlett’s seminal 1939 Stanford thesis and HP Model 200A audio oscillator using a simple incandescent lightbulb for automatic gain stabilization and pure sinusoidal audio.',
      keyTechnologies: ['Wien Bridge Transfer Function Analysis', 'Tungsten Filament Thermal Resistance ODE', 'Web Audio API Sinusoidal Oscillator'],
    },
    component: Experiment191WienBridgeAudioOscillator,
  },
  {
    meta: {
      id: '192',
      number: '192',
      title: 'Jean Frédéric Frenet & Joseph Serret Differential Space Curve Kinematics',
      category: 'Physics & Geometry',
      tags: ['Frenet-Serret', 'Differential Geometry', 'Curvature & Torsion', 'TNB Frame', 'Kinematics'],
      mechanismSignature: '3D Parametric Trajectory r(s) -> Tangent T, Principal Normal N, Binormal B Orthogonal Triad -> Frenet-Serret Differential Equations (dT/ds = κN, dN/ds = -κT + τB, dB/ds = -τN) -> Moving Frame Tracking',
      designSignature: 'Typography: Classical Differential Geometry Serif · Color: Tangent Vector Crimson, Normal Vector Emerald, Binormal Vector Royal Blue · Composition: 3D Toroidal Knot & Orthogonal Triad',
      description: 'The foundational Frenet-Serret frame of 3D differential curve geometry: tracking the evolving tangent, normal, and binormal vectors along tortuous space curves.',
      keyTechnologies: ['Frenet-Serret Derivative Matrix Formulas', '3D Knot Parametric Space Curve Generator', 'Interactive Curvature and Torsion Modulators'],
    },
    component: Experiment192FrenetSerretSpaceCurveKinematics,
  },
  {
    meta: {
      id: '193',
      number: '193',
      title: 'Erwin Schrödinger Quantum Superposition Cat State Decoherence',
      category: 'Physics & Geometry',
      tags: ['Schrödinger Cat', 'Quantum Decoherence', 'Wigner Function', 'Density Matrix', 'Superposition'],
      mechanismSignature: 'Entangled Quantum Superposition (|Alive⟩ + |Dead⟩)/√2 -> Environmental Coupling Reservoir -> Off-Diagonal Density Matrix Element Decay -> Quantum-to-Classical State Transition',
      designSignature: 'Typography: Quantum Paradox Serif · Color: Superposition Cyan vs Classical Thermal Ash Gray · Composition: Wigner Quasi-Probability Phase Distribution & Purity Gauge',
      description: 'Erwin Schrödinger’s 1935 cat thought experiment simulated through the rigorous lens of modern quantum decoherence theory and Wigner quasi-probability negativity destruction.',
      keyTechnologies: ['Wigner Function Phase Space Matrix', 'Lindblad Master Equation Decoherence Damping', 'Quantum State Purity / Entropy Tracker'],
    },
    component: Experiment193SchrodingerCatQuantumDecoherence,
  },
  {
    meta: {
      id: '194',
      number: '194',
      title: 'Josef Stefan & Ludwig Boltzmann Thermal Blackbody Radiation Cube',
      category: 'Physics & Geometry',
      tags: ['Stefan-Boltzmann', 'T4 Law', 'Thermal Radiation', 'Heat Transfer', 'Blackbody Emissivity'],
      mechanismSignature: 'Heated Emissive Cube Faces with Varying Emissivities (Polished Silver, Oxidized Copper, Matte Black) -> Total Radiated Power P = ε·σ·A·T⁴ -> Thermopile Distance-Inverse Sensor Reading',
      designSignature: 'Typography: Classical Heat Physics Serif · Color: Leslie Cube Metallic Patina & Incandescent Infrared Heat-Field Contours · Composition: 3D Rotating Thermal Cube & Sensor Needle',
      description: 'John Leslie’s cube and the Stefan-Boltzmann law P = ε·σ·A·T⁴: demonstrating how radiative heat emission scales with the fourth power of absolute temperature and surface emissivity.',
      keyTechnologies: ['Stefan-Boltzmann Radiant Heat Equation', 'Inverse-Square Radiative Flux Geometry', 'Dynamic Thermal False-Color Infrared Shader'],
    },
    component: Experiment194StefanBoltzmannRadiationThermalCube,
  },
  {
    meta: {
      id: '195',
      number: '195',
      title: 'Brahmagupta & Bhāskara II Pellian Chakravala Diophantine Solver',
      category: 'Simulation',
      tags: ['Chakravala', 'Pell Equation', 'Diophantine Equations', 'Ancient Indian Mathematics', 'Number Theory'],
      mechanismSignature: 'Indeterminate Quadratic Diophantine Equation x² - N·y² = 1 -> Bhāskara II Cyclic Chakravala Algorithm -> Continued Fraction Modulo Optimization -> Rapid Discovery of Huge Integer Solutions',
      designSignature: 'Typography: Classical Sanskrit Mathematical Serif · Color: Ancient Vellum Sepia & Terracotta Ink Highlights · Composition: Cyclic Chakravala Dial & Equation Step Ledger',
      description: 'The 12th-century Indian Chakravala method: a cyclic algorithm for solving Pell’s equation x² - N·y² = 1 centuries before Euler and Lagrange rediscovered continued fractions.',
      keyTechnologies: ['Cyclic Chakravala Diophantine Algorithm', 'Arbitrary Precision BigInt Arithmetic', 'Geometric Modulo Lattice Projection'],
    },
    component: Experiment195PellianEquationDiophantineChakravala,
  },
  {
    meta: {
      id: '196',
      number: '196',
      title: 'Stephen Wolfram & Matthew Cook Rule 110 Universal Turing Cellular Automaton',
      category: 'Simulation',
      tags: ['Rule 110', 'Universal Computation', 'Elementary Automata', 'Glider Collisions', 'Turing Completeness'],
      mechanismSignature: '1D Elementary Binary Cell Ruleset (01101110) -> Asymmetric Phase Space -> Complex Gliders, Ethers, and Mobile Solitary Structures -> Proven Universal Turing Machine Capability',
      designSignature: 'Typography: Discrete Mathematics Mono · Color: High-Contrast Obsidian & Glider Trace Amber Glow · Composition: Space-Time Vertical Cellular Tapestry',
      description: 'Stephen Wolfram and Matthew Cook’s Rule 110: the simplest known one-dimensional elementary cellular automaton capable of universal Turing computation through localized glider collisions.',
      keyTechnologies: ['1D Cellular Automaton Bitwise Stepper', 'Glider Detection and Trajectory Overlay', 'Infinite Space-Time Tapestry Scroll Engine'],
    },
    component: Experiment196TuringCompleteRule110Automaton,
  },
  {
    meta: {
      id: '197',
      number: '197',
      title: 'Frank Drake & Carl Sagan Arecibo Interstellar Radio Message',
      category: 'Audio & Signals',
      tags: ['Arecibo Message', 'SETI', 'Interstellar Radio', 'Prime Factors 73x23', 'Binary Pictogram'],
      mechanismSignature: '1,679 Binary Bits Transmitted at 2,380 MHz -> Semiprime Factoring (73 rows × 23 columns) -> Decoding Numbers 1-10, DNA Nucleotides, Double Helix, Human Figure, Solar System, Telescope',
      designSignature: 'Typography: Interstellar Radio Astronomy Mono · Color: Arecibo Multi-Color Pictogram (Red DNA, Yellow Human, Blue Telescope, Cyan Numbers) · Composition: 73x23 Matrix & FSK Audio Modulation',
      description: '1974 Frank Drake and Carl Sagan interstellar radio message transmitted toward Messier 13: 1,679 bits arranged into a 73×23 grid encoding fundamental human and terrestrial knowledge.',
      keyTechnologies: ['Semiprime Raster Reconstruction Algorithm', 'Frequency-Shift Keying (FSK) Sound Synthesis', 'Interactive Bitstream Decoder Matrix'],
    },
    component: Experiment197AreciboInterstellarRadioMessage,
  },
  {
    meta: {
      id: '198',
      number: '198',
      title: 'Theodor Kaluza & Oskar Klein 5th Compactified Dimension Topology',
      category: 'Physics & Geometry',
      tags: ['Kaluza-Klein', 'Extra Dimensions', 'Compactification', 'Unification Theory', 'Cylinder Condition'],
      mechanismSignature: '5D General Relativity Spacetime -> 5th Dimension Curled into Microscopic Circle S¹ at Planck Length -> Emergence of 4D Einstein Gravity + Maxwell Electromagnetism from Pure Geometry',
      designSignature: 'Typography: Higher-Dimensional Theoretical Physics Serif · Color: Spacetime Grid Indigo & Compactified 5D Fiber Torus Rose Gold · Composition: 3D Grid with Compactified Fiber Bundles',
      description: 'Theodor Kaluza and Oskar Klein’s 1921 unification of gravity and electromagnetism by hypothesizing a compactified microscopic fifth circular spatial dimension.',
      keyTechnologies: ['Kaluza-Klein Metric Fiber Bundle Projection', '3D Isometric Toroidal Compactification Rendering', 'Higher-Dimensional Geodesic Raycasting'],
    },
    component: Experiment198KaluzaKleinExtraDimensionCompact,
  },
  {
    meta: {
      id: '199',
      number: '199',
      title: 'Roger Penrose & Stephen Hawking Gravitational Spacetime Singularity',
      category: 'Physics & Geometry',
      tags: ['Penrose-Hawking', 'Singularity Theorems', 'Event Horizon', 'Infalling Geodesics', 'General Relativity'],
      mechanismSignature: 'Trapped Surface Formation -> Raychaudhuri Infalling Geodesic Focusing -> Inevitable Spacetime Incompleteness -> Singularity with Infinite Curvature and Event Horizon Emergence',
      designSignature: 'Typography: Relativistic Astrophysics Serif · Color: Gravitational Redshift Crimson, Event Horizon Void Black, Photon Sphere Gold · Composition: Infalling Spacetime Light Cone Grid',
      description: 'Sir Roger Penrose and Stephen Hawking’s singularity theorems proving that within general relativity, gravitational collapse inevitably forms a central spacetime singularity.',
      keyTechnologies: ['Schwarzschild Metric Geodesic Raytracer', 'Light Cone Gravitational Tipping Simulation', 'Raychaudhuri Infalling Focusing Integrator'],
    },
    component: Experiment199PenroseHawkingBlackHoleSingularity,
  },
  {
    meta: {
      id: '200',
      number: '200',
      title: 'Omni-Synthesis 200: Unified Computational Polymath Grand Masterpiece',
      category: 'Physics & Geometry',
      tags: ['200th Milestone', 'Omni-Synthesis', 'Grand Finale', 'Unified Field', 'Harmonic Symphony', 'Masterpiece'],
      mechanismSignature: 'Synthesizing All 200 Disciplines: Quantum Phase Fields + Relativistic Spacetime Geodesics + Fluid Navier-Stokes Vorticity + Chaotic Attractors + Harmonic Polyphonic Audio Matrix',
      designSignature: 'Typography: Monumental Polymath Inscriptional Serif · Color: Multiverse Spectrum Chromatic Dispersion, Gold Leaf Geometry, Void Black Void · Composition: Full-Screen Harmonious Polymath Engine',
      description: 'The 200th Grand Master Milestone: a unified computational synthesis harmonizing quantum mechanics, celestial kinematics, fluid vortices, mathematical chaos, and generative polyphonic acoustics.',
      keyTechnologies: ['Unified Multi-Physics Canvas Engine', 'Polyphonic Pythagorean Just-Intonation Synthesizer', 'Real-Time Inter-Domain Parametric Coupling'],
    },
    component: Experiment200OmniSynthesisGrandFinale200,
  },
];

