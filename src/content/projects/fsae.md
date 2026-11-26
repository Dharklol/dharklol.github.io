---
title: Formula SAE Engineering
summary: Steering subsystem leadership, mechanical reliability, design trade studies and experimental vehicle dynamics at WashU Racing.
discipline: Mechanical engineering
order: 1
kind: fsae
status: WUFR-27 design and verification
tags: [Steering, Mechanical design, CAD, FMEA, Experimental methods]
---

## Engineering a reliable steering system

As suspension lead for WashU Racing, I headed the WUFR-26 and WUFR-27 steering final design reviews. I owned design and delivery of the WUFR-26 steering system, from CAD and drawing release to manufacturing, assembly, fitment and vehicle integration. My broader suspension responsibilities include a roughly nine-member team, 19 major assemblies and more than 120 part-numbered components. The design challenge is not simply to maximize a geometric steering metric: it is to deliver predictable response with limited free play, adequate stiffness, repeatable manufacture and straightforward maintenance.

The project spans previous-car design evidence, failure investigation, a revised mechanical coupling, and an analytical workflow that connects steering to suspension and vehicle motion. This work is part of a collaborative Formula SAE program; the vehicle and its testing are team efforts.

## Design evolution: WUFR-26 to WUFR-27

The WUFR-26 design targeted a 20% reduction in steering effort through rack placement, tie-rod and steer-arm changes, and selection of a slower rack. The design trade study predicts a reduction from 20 to 17.2 N·m (14%) against the prior design, with the trade-off of increased maximum steering-wheel travel to approximately ±102°. This is a modeled design result, not a measured reduction in driver torque. The WUFR-26 review separately records an earlier parked-effort test averaging 35.12 N·m against a calculated 34 N·m; that is a different load case.

[![Ackermann preservation and steering effort trade study](/figures/fsae/binder/ackermann-optimization.jpg)](/figures/fsae/binder/ackermann-optimization.jpg)

*WUFR-26 design binder, p. 42. Original modeled design trade study; select the figure to enlarge.*

For WUFR-27 the team retained the nominal rack, tie-rod and steer-arm geometry because there was no reviewed physical evidence that the existing geometry was the dominant weakness. Instead, recurrent free play, slipping and failure of a friction-dependent shaft coupling motivated a reliability-focused redesign.

| Design consideration | WUFR-26 review | WUFR-27 direction |
| --- | --- | --- |
| Steering geometry | 3.5 in/rev nominal rack; approximately 67.7% Ackermann reported in the specification | Retain nominal design as regression baseline |
| Column coupling | Set-screw-dependent torque transfer; recurring slip and approximately 5° observed free play | Positive double-D mechanical engagement |
| Axial retention | Coupled to the previous joint arrangement | Separate mechanical retainer |
| Serviceability | Four tools for bevel-box service | Three-tool target without extra housing mass |
| Verification | Distributed CAD studies, spreadsheets and historical fits | Source-controlled mechanism and explicit physical correlation plan |

These are design-review dispositions, not a declaration of installed performance for the new car.

## Steering kinematics and the Ackermann question

For ideal low-speed Ackermann geometry with wheelbase $L$ and front track $t$, the inside and outside wheel angles satisfy

$$
\cot\delta_o-\cot\delta_i=\frac{t}{L}.
$$

That is a useful kinematic baseline, but it does not prescribe a universal performance-optimal wheel-heading split. A tire's slip angle depends on wheel orientation relative to local velocity, which changes with sideslip, yaw rate and wheel location. The lateral force needed from each tire also depends on its normal load and operating condition.

The rigid steering evaluator therefore solves the linkage closure at a specified rack displacement and suspension pose, then projects the wheel-plane orientation onto the road plane. A bounded tire-force inversion and motion-aware target provider allow the desired headings to vary with the supplied vehicle state. A tire proxy remains explicitly identified rather than silently treated as the intended compound.

![Software-generated nominal upright rotation sweep](/figures/fsae/rigid-steering-sweep.svg)

*Replotted from the [steering implementation benchmark](https://github.com/Dharklol/Proprietary-Suspension-Software-Development/blob/3300377a39bba1f4b27400794b6f30aa2b1ca00b/benchmarks/steering/implementation_results_v0.1.0.json). Incremental upright rotation at five rack positions, not projected road-wheel heading or a measured response.*

The lesson was to separate what geometry can achieve from what a particular vehicle state demands. The related [vehicle dynamics simulation case study](/projects/vehicle-dynamics/) explains the coupled equilibrium and verification work in more detail.

## Mechanical redesign: torque transfer and fit

<!-- portfolio-photo:steering-build -->

The prior set-screw interface transferred torque through localized contact and friction. The replacement double-D profile transfers torque through positive mating surfaces, with axial retention handled separately. Steel was retained after a proposed aluminum column and quick-release concept was evaluated against compatibility, procurement timing and marginal mass benefit.

The change introduces a new engineering problem: controlling manufacturing clearance without binding or introducing excessive backlash. An idealized centered-profile calculation makes that trade-off explicit.

![Conceptual cross section of a double-D shaft and mating bore](/figures/fsae/double-d-concept.svg)

*Figure 1. Conceptual cross-section, not a production drawing.*

For circular radius $R$, center-to-flat distance $a$, half-chord $b=\sqrt{R^2-a^2}$ and positive diametral across-flats clearance $C$, first contact in the ideal concentric model occurs when

$$
a\cos\theta+b\sin\theta=a+\frac{C}{2}.
$$

The corresponding bidirectional angular lost motion is

$$
\Delta\theta_{\mathrm{bi}}=
2\left[
\arcsin\left(\frac{a+C/2}{R}\right)-
\arcsin\left(\frac{a}{R}\right)
\right].
$$

This model gives a direct relationship between dimensional clearance and rotational free play. It does not include eccentricity, manufacturing form error, corner radii, weld distortion or wear.

![Calculated bidirectional lost motion versus across-flats clearance](/figures/fsae/backlash-sensitivity.svg)

*Figure 2. Ideal centered-profile sensitivity from the reviewed double-D fit calculation. These are calculated single-joint values, not measured full-system free play or approved drawing tolerances.*

| Actual across-flats clearance (in) | Ideal bidirectional lost motion per joint (°) |
| ---: | ---: |
| 0.0005 | 0.162 |
| 0.0010 | 0.324 |
| 0.0020 | 0.650 |
| 0.0050 | 1.634 |
| 0.0100 | 3.301 |

The team's approximate in-house ±0.005 in capability on each independently machined profile can produce an across-flats size difference ranging from −0.010 to +0.010 in if the nominal dimensions coincide. One extreme interferes; the other admits substantial lost motion. Precision machining of the female profile alone does not solve the tolerance stack unless the male profile is also measured or tightly controlled.

This is why the design review recommends a precision internal-profile process such as wire EDM, matched or controlled male dimensions, and inspection of the assembled interface.

## Stiffness and load-path analysis

Elastic torsion is not the same as backlash. For a circular shaft or tube under torque $T$,

$$
J=\frac{\pi}{32}(D_o^4-D_i^4),\qquad
\theta=\frac{TL}{GJ}.
$$

The current circular-span model evaluates four steel shaft/column spans under prescribed structural torque cases.

| Calculated torque case | Torque (N·m) | Estimated elastic twist (°) |
| --- | ---: | ---: |
| Cornering | 14.444 | 0.638 |
| Parked | 23.698 | 1.047 |
| Factored parked | 35.547 | 1.571 |

The final row is already factored. These values cover the modeled free circular spans only, not the complete assembly, welds, mating contact, gearbox or rack. They are not measured steering effort or a fatigue load spectrum.

The design review separately considers noncircular shaft torsion, local contact, weld sizing, axial retainer and lug checks, stress concentration and fatigue sensitivity. Material certification, as-built fit and final weld geometry remain necessary before structural release.

## Validation and testability

<!-- portfolio-photo:suspension-failure -->

A 26-mode steering FMEA informs the proposed validation sequence. The objective is to distinguish manufacturing fit, elastic response, mechanical lost motion and the nominal rigid kinematics rather than folding them into a single unexplained steering error.

The planned component and installed-system work includes direction-reversing angular sweeps, proof and cyclic loading, backlash and hysteresis measurement, gear and bearing inspection, and correlation between steering input, rack travel and road-wheel headings. A rotary primary-shaft sensor complements the existing linear rack sensor.

## Experimental suspension engineering

<!-- portfolio-photo:competition-setup -->

<!-- portfolio-photo:car-on-track -->

Before leading the subsystem, I designed fixtures for Instron load-frame testing and characterized anti-roll-bar behavior across five adjustment settings, with loads up to 2,000 N. Measured component stiffness ranged from approximately 902 to 2,634 N/mm. I compared load-deflection data with analytical and FEA predictions to assess the component contribution to suspension roll stiffness. These are component test stiffnesses, not wheel rates or whole-vehicle roll stiffness.

[![Instron anti-roll bar load-deflection curves](/figures/fsae/binder/arb-instron.jpg)](/figures/fsae/binder/arb-instron.jpg)

*WUFR-26 design binder, p. 47. Calculated section properties and recorded load-deflection curves for five settings.*

I also developed a chassis–suspension torsional-stiffness and load-transfer sensitivity analysis after competition feedback. The design objective was to keep chassis-induced lateral load-transfer redistribution below approximately one percentage point while preserving anti-roll-bar tuning authority. This is an analytical design criterion rather than a measured on-car result.

[![Calculated load transfer sensitivity contours](/figures/fsae/binder/load-transfer-sensitivity.jpg)](/figures/fsae/binder/load-transfer-sensitivity.jpg)

*WUFR-26 design binder, p. 50. Calculated sensitivity, not measured vehicle load transfer.*

The WUFR-26 suspension design binder (p. 49) reports the following signed understeer-gradient fits, using a linear assumption through 0.8 g:

| Front / rear ARB setting | CCW (deg/g) | CW (deg/g) |
| --- | ---: | ---: |
| 1 / 5 | −6.22 | 3.15 |
| 1 / 3 (driver preference) | −2.82 | 4.28 |
| 5 / 1 | −0.90 | 4.45 |

[![Original directional steering response curves](/figures/fsae/binder/understeer-curves.jpg)](/figures/fsae/binder/understeer-curves.jpg)

*WUFR-26 design binder, p. 48. Original CW and CCW response plots.*

![Signed directional understeer gradients for three ARB settings](/figures/fsae/understeer-gradients.svg)

*Replotted from the WUFR-26 design binder, p. 49. Signs and directional labels are preserved as reported; the values are not averaged across directions. The preferred setup reflects driver feedback, not proof of a universally optimal balance.*

The team binder (p. 8) also records endurance telemetry exceeding 1.6 g lateral acceleration and reaching 1.2 g braking. These are team vehicle observations, not predictions of the simulation platform. The separate parked steering test on p. 44 reports 5.80° observed backlash against 5° expected and 13.53 N·m observed effort against 30.20 N·m expected; it is not directly comparable with the modeled 20-to-17.2 N·m design trade study.

[![Endurance telemetry acceleration plot and speed distribution](/figures/fsae/binder/endurance-gg.jpg)](/figures/fsae/binder/endurance-gg.jpg)

*WUFR-26 design binder, p. 8. Team vehicle telemetry, not simulation output.*

The team archive contains vehicle test notes, driver feedback, setup sheets and logged skidpad data. Quantitative handling conclusions require matched test conditions, calibrated channels and a reviewed analysis; they are not inferred from file names or isolated lap times.

## Manufacturing documentation

The steering drawing set includes the left bevel-box housing (7075-T6 aluminum) and secondary shaft (AISI 4130 steel), both prepared by L. Lee with my system-lead review recorded in the title blocks. These are examples of drawing review, material selection, datum-based dimensional control and manufacture-oriented documentation. The original team drawing sheets are supplied below as examples of engineering documentation, with authorship and revision blocks preserved. They are dated design records, not current manufacturing authorization.

Associated engineering calculations:

- [Double-D fit and contact sizing](https://github.com/Dharklol/Proprietary-Suspension-Software-Development/blob/3300377a39bba1f4b27400794b6f30aa2b1ca00b/docs/models/steering/wufr27_double_d_fit_contact_screen.md)
- [Nominal steering transmission and compliance study](https://github.com/Dharklol/Proprietary-Suspension-Software-Development/blob/3300377a39bba1f4b27400794b6f30aa2b1ca00b/docs/models/steering/wufr27_design_source_compliance_v1.md)
- [Vehicle dynamics simulation project](/projects/vehicle-dynamics/)
