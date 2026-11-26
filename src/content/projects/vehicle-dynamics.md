---
title: Vehicle Dynamics Simulation
summary: A computational mechanics platform for coupled suspension and steering analysis, numerical verification and reproducible vehicle design studies.
discipline: Computational mechanics
order: 2
kind: dynamics
status: Analytical development · physical correlation pending
tags: [Python, Multibody mechanics, Nonlinear solvers, Model verification]
---

## Motivation

A Formula SAE suspension does not behave as a collection of independent geometry calculators. Steering changes wheel orientation, contact geometry and tire forces; those forces change the load distribution and body pose, which in turn alter the steering and suspension state. A design comparison that holds the wrong quantities fixed can therefore produce a misleading result.

I have been developing a local-first vehicle dynamics platform that treats these dependencies as a coupled mechanical problem. The project grew out of practical steering and suspension engineering and aims to make design studies reproducible, with explicit inputs, mechanical derivations and independently checked numerical results.

The current emphasis is analytical development rather than a finished lap simulator or a calibrated digital twin.

## Architecture

![Architecture of the coupled steady-cornering solver](/figures/vehicle-dynamics/solver-architecture.svg)

*Figure 1. Conceptual architecture derived from the implemented steady-cornering kernel; not a complete software module diagram.*

The Python model separates the underlying mechanical providers from numerical solution, design-study orchestration and downstream visualization:

- **Geometry and kinematics:** suspension and steering constraints, wheel poses, material contact points and their Jacobians, evaluated at the current trial state.
- **Force providers:** springs, anti-roll bars, gravity and source-bounded lateral tire response. Geometry, setup and tire revisions are explicit.
- **Coupled solver:** body motion, sideslip, rack demand and normal reactions are solved together rather than treating load transfer as a fixed input.
- **Verification and reporting:** independent force and moment checks, branch tracking, failure diagnostics, reproducible reports and an offline analytical comparison viewer.

The model is headless; the reporting layer consumes solved evidence rather than implementing its own physics.

## Mathematical formulation

### Steady cornering as a nonlinear equilibrium problem

Given a prescribed forward speed V and signed path curvature κ, the steady yaw rate is r = Vκ and the magnitude of the planar acceleration is V²|κ|. The model evaluates wheel velocities and signed tire slips from the current motion and geometry, including nonzero body sideslip.

The ten unknowns are body heave, roll and pitch; sideslip; rack displacement; a virtual tangential holding force at the current center of mass; and the four wheel normal reactions. In compact notation:

```text
x = [z, φ, θ, β, s, H, Fz_FL, Fz_FR, Fz_RL, Fz_RR]
R(x; V, κ, configuration) = 0
```

Three reduced body balances, four constrained wheel balances, two horizontal force balances and one yaw balance form the ten residual equations. At each trial, lateral tire forces are evaluated forward at the trial normal load, pressure, slip and inclination, rather than prescribing their values in advance.

The holding force is an explicit idealization needed to prescribe steady speed in this model. It is not a measured drive force or steering effort.

### Virtual work and physical closure

A central issue in the mechanics is how forces are mapped into generalized coordinates. For a force F applied to a material point p with Jacobian J = ∂p/∂q, its generalized force contribution is JᵀF. The model also checks the full physical force and moment balance independently of the reduced equations.

During development, an important discrepancy emerged: differentiating the moving geometric lowest point of a rolling circular tire is not equivalent to differentiating the instantaneous material point to which the force is applied. The former can satisfy the reduced equations while violating independent moment closure.

In a synthetic cornering case, the incorrect mapping left approximately 1.5 × 10⁻⁵ N·m of pitch-moment residual. The independent gate rejected it. The correction freezes the instantaneous contact material point when evaluating virtual work, while contact-gap derivatives continue to follow the geometric locus. The force law and physical acceptance limits were not relaxed.

This is a useful example of the difference between solving the equations that were written and verifying that those equations describe the intended mechanical system.

### Numerical methods

The nonlinear system is solved using scaled, bounded, damped Newton iterations. The solver records conditioning diagnostics and retains failed trial evaluations; ordered curvature continuation uses previously accepted states while preserving the declared source branch. Unsupported tire queries, geometry/contact failures and nonconvergence are distinct outcomes.

A root is only accepted when both the numerical residual gate and the independently assembled physical force and moment gates pass. Multiple roots and numerical boundaries are not treated as proof of physical instability or a unique vehicle response.

## Verification against an independent analytical model

Before relying on native vehicle inputs, I use manufactured reference cases whose expected behavior is derived independently. A particularly useful reference is the small-angle steady-state bicycle model.

For mass m, CG-to-axle distances a and b, wheelbase L = a + b, and **whole-axle** cornering stiffnesses C_f and C_r, the linear force and yaw balances give the first-order front steering gradient:

```text
F_f + F_r = m V² κ
a F_f − b F_r = 0

δ/κ = L + (m V²/L)(b/C_f − a/C_r)
β/κ = b − m V²a/(L C_r)
```

The four-wheel kernel is expected to approach these expressions in the small-curvature limit, not reproduce them exactly at finite curvature. The independent reference uses declared synthetic fixture constants only, not the coupled solver's own outputs.

Three stiffness pairs at two speeds were evaluated at zero curvature and at three signed curvature step sizes. Centered finite-step gradients were compared with independently derived steering, sideslip and axle-force gradients.

| Manufactured axle stiffnesses (N/rad), at 8 m/s | Analytical δ/κ (m) | Coupled gradient (m) |
| --- | ---: | ---: |
| C_f = 3200, C_r = 3200 | 1.50000000 | 1.50000039 |
| C_f = 2400, C_r = 3600 | 2.03333333 | 2.03333430 |
| C_f = 3600, C_r = 2400 | 0.96666667 | 0.96666660 |

**42 of 42 manufactured solves passed** and all six fixture comparisons met the predefined criteria. The maximum final normalized gradient error was approximately 6.13 × 10⁻⁷. Halving the curvature step reduced leading comparison error by approximately four, consistent with a second-order centered limit.

These are verification results for a deliberately simplified experiment, not estimates of real-car predictive accuracy.

## An analytical design study: rack position

Once the solver had an internally consistent native composition, I used it for a controlled steering-geometry comparison. The question was whether a small fore-aft rack displacement changes the required rack travel and front wheel-heading split after the vehicle is re-equilibrated, and whether the effect survives selected modeling perturbations.

Three symmetric geometries were considered: reference, 5 mm aft and 5 mm forward. Tie-rod lengths were re-derived to maintain center closure; other hardpoints and rack travel bounds remained fixed.

The study used a provisional native configuration at 8 m/s. Each candidate was solved at five curvatures (0, ±0.06 and ±0.10 m⁻¹). At the two higher-curvature cases, six additional one-at-a-time stresses changed front toe (±0.2°), front camber (±0.5°), or lateral tire-force gain (±5%).

That gives 3 × (5 + 2 × 6) = **51 distinct operating cells**. Every cell was re-equilibrated rather than reusing the reference vehicle state.

### Results

All 51 cells ultimately satisfied the declared acceptance gates. One required a guarded numerical recovery, so there were 52 attempts; the failed initial attempt remains in the evidence. The largest independent physical force and moment residuals were 1.272 × 10⁻⁷ N and 1.290 × 10⁻⁷ N·m.

Across both high-curvature directions and the seven assumptions, the magnitude of the rack-demand change from the reference was 0.0832–0.0854 mm, and the front heading-split change was 0.0326–0.0341°. The candidate effects retained their respective signs over those cases.

![Two horizontal bar charts comparing maximum absolute rack demand and front heading split changes for the rack offset and toe, camber and tire force gain perturbations.](/figures/vehicle-dynamics/steering-sensitivity.svg)

*Figure 2. Replotted results from the recorded analytical design study. Rack-offset effects compare the candidates to the reference under matching assumptions; the other rows compare individual perturbations with nominal assumptions on the reference geometry. Different perturbation sizes and baselines mean this is not a normalized sensitivity or uncertainty comparison.*

| Perturbation | Maximum absolute rack change (mm) | Maximum absolute heading-split change (°) |
| --- | ---: | ---: |
| Rack offset ±5 mm | 0.0854 | 0.0341 |
| Front toe ±0.2° | 0.0523 | 0.379 |
| Front camber ±0.5° | 0.0206 | 0.00489 |
| Lateral force gain ±5% | 0.00616 | 0.00466 |

The toe perturbation produces a much larger heading-split response than the rack displacement in this experiment. This is not proof that toe is more important for handling; toe directly changes nominal heading split. It is a reason to keep alignment explicit when interpreting small geometric effects.

The study did not select a preferred candidate, establish packaging feasibility or predict actual steering effort. Front heading split is not itself an Ackermann percentage. The tire representation also includes provisional proxy and symmetry assumptions that have not been correlated to the car.

## Diagnosing the computational envelope

A separate continuation experiment investigated whether failure at higher curvature was a numerical or physical boundary. At 8 m/s, the original solver bounds admitted solutions at |κ| = 0.12 m⁻¹ (approximately 0.78 g of prescribed kinematic acceleration), but failed at the next refined tested point, 0.125 m⁻¹.

A control experiment widened only the sideslip bound from ±0.08 to ±0.10 rad. Both directions converged on the original source branch at the previously failed curvature. The recovered roots lay just outside the original bound. This showed that the original stopping point excluded those roots numerically; it did not establish a tire grip or vehicle handling limit.

This distinction matters for design optimization: a failed nonlinear solve cannot simply be classified as poor handling, nor can a small residual establish physical fidelity.

## Current scope and next steps

The platform currently supports an internally synchronized, uncorrelated steady-cornering development workflow, with separate steering geometry and prescribed-load mechanical analyses. Its next technical increment is reduced transient modeling: wheel-coordinate stiffness, modal analysis and bounded quarter-car response with independent reference cases.

Physical correlation, measured tire and damper inputs, full maneuver-dependent steering effort, integrated combined-slip/braking and aerodynamic models, and lap simulation remain future work or separately bounded calculations. I intend to compare appropriate model outputs with measured data when the vehicle and instrumentation are available.

## Source and reproducibility

The project retains versioned configurations, test fixtures, failed attempts and machine-readable evidence. The design-comparison workflow produces JSON, CSV, figures and an offline viewer; its results are not dependent on the portfolio website.

- [Source repository](https://github.com/Dharklol/Proprietary-Suspension-Software-Development)
- [Steady-cornering kernel verification](https://github.com/Dharklol/Proprietary-Suspension-Software-Development/blob/3300377a39bba1f4b27400794b6f30aa2b1ca00b/docs/reviews/steady_cornering_development_kernel_review.md)
- [Independent low-force analytical reference](https://github.com/Dharklol/Proprietary-Suspension-Software-Development/blob/3300377a39bba1f4b27400794b6f30aa2b1ca00b/docs/reviews/analytical_low_force_reference_review.md)
- [Computational envelope investigation](https://github.com/Dharklol/Proprietary-Suspension-Software-Development/blob/3300377a39bba1f4b27400794b6f30aa2b1ca00b/docs/reviews/native_computational_envelope_review.md)
- [Analytical design comparison report](https://github.com/Dharklol/Proprietary-Suspension-Software-Development/blob/3300377a39bba1f4b27400794b6f30aa2b1ca00b/docs/reviews/analytical_design_workflow_review.md)
- [Machine-readable design comparison summary](https://github.com/Dharklol/Proprietary-Suspension-Software-Development/blob/3300377a39bba1f4b27400794b6f30aa2b1ca00b/benchmarks/vehicle/analytical_design_workflow_summary_v0.1.0.json)
- [Phase 2 and transient development scope](https://github.com/Dharklol/Proprietary-Suspension-Software-Development/blob/3300377a39bba1f4b27400794b6f30aa2b1ca00b/docs/roadmaps/phase2_scope_and_transient_entry_v0.1.0.md)

The links to evidence above are pinned to the source revision reviewed for this case study. Figures and numerical results are presented with their experimental scope; no physical correlation or vehicle-level accuracy is implied.
