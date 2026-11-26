---
title: Wydown
summary: Independent quantitative research, event-driven financial data acquisition and reproducible portfolio accounting.
discipline: Quantitative research & systems
order: 3
kind: wydown
status: Research and architecture development
tags: [Python, OCaml, Market data, Event sourcing, Quantitative research]
---

## Research motivation

Wydown is the umbrella for my independent work on quantitative research and the systems required to make financial experiments reproducible. The central question is how to distinguish a real economic observation from a consequence of data handling, execution assumptions or an accounting error.

The work has two connected directions: empirical research using market and credit data, and a portfolio framework designed around precise financial state, reproducible experiments and risk boundaries. The related real-time acquisition infrastructure is a research system, not evidence of a production trading platform.

## Real-time data acquisition

Market microstructure research requires preserving the sequence of market events rather than relying only on periodically sampled prices. My recorder work uses a snapshot-and-delta approach to order-book reconstruction, with trade events, reconnect boundaries, source sequence information and integrity diagnostics.

A lightweight Linux edge environment supports long-running acquisition, while cloud instances are useful for controlled latency comparisons. The accompanying control-plane repository deliberately restricts remote operations to the research project: file paths, service actions and permitted Git operations are bounded; arbitrary shell access is excluded.

The engineering priorities are data integrity, reproducibility and observable failure. A reconnect or missing sequence is a distinct condition, not an invitation to silently fabricate an uninterrupted book.

## Empirical research

I use recorded data to investigate conditional market response and cross-market relationships, with controls such as placebo comparisons and sensitivity to quote age. Separately, systematic portfolio research considers trend, cross-sectional momentum and valuation/profitability signals, with research hypotheses and evaluation rules specified before performance interpretation.

Another research direction studies credit-market transmission, including structured-finance and infrastructure financing data. The goal is to build traceable observations and test hypotheses, not present exploratory relationships as proven predictive signals.

These experiments have distinct data sources, validation requirements and stages of maturity. No investment return, trading edge or live profitability is claimed.

## Portfolio architecture

The Wydown repository currently describes a specification-stage, independently accounted portfolio framework. An important design decision is to distinguish a research signal from an order intent, risk decision, broker acknowledgement and executed fill.

![Proposed event and portfolio state architecture](/figures/wydown/event-architecture.svg)

*Figure 1. Conceptual design derived from the current repository specifications; not a deployed execution pipeline.*

The canonical event contract distinguishes economic time, first observation and durable ingestion. Source identities and normalized fact fingerprints support idempotent replay. A duplicate delivery is retained as a receipt, but must not create a second economic transaction. A changed payload under an existing identity is an integrity fault rather than an ordinary duplicate.

## Point-in-time research and reproducibility

A historical valuation must not incorporate information unavailable at the decision cutoff. In the proposed contract, an eligible event or mark must satisfy both

$$
t_{\mathrm{event}}\le T,\qquad
t_{\mathrm{ingested}}\le K,
$$

where $T$ is the economic valuation time and $K$ is the knowledge cutoff. A late correction produces a new, versioned restatement instead of rewriting the previously recorded as-known decision.

The same distinction is important in historical strategy research. Data vintage, universe selection, publication timing, execution costs and evaluation partitions must be explicit to prevent a backtest from inadvertently using information from the future.

## Exact financial arithmetic and accounting

The domain specification uses decimal wire values and checked integer-scaled monetary representation rather than binary floating-point values for accounting. Exact intermediate products are rounded once at a defined posting boundary. Financial events project into balanced double-entry transactions:

$$
\sum_i p_i=0
$$

for the postings in a transaction and currency. The proposed accounting architecture separates authoritative events from rebuildable positions, valuation marks and risk views. Missing marks are unpriced states rather than zero-value holdings, and external cash contributions are not investment returns.

Research, paper and live accounts remain distinct. The system is designed to fail closed when a required fact, supported instrument lifecycle or reliable valuation is missing.

## Current state

The public portfolio repository remains at the architecture/specification stage, with review-draft domain and ledger contracts and no production broker integration or live trading enabled. The recorder and empirical research are associated independent workstreams rather than claims that a complete Wydown trading system has been deployed.

Future work is to finish data readiness and reproducible research runs, validate strategy hypotheses against frozen evaluation rules, and implement the accounting and risk interfaces against independent fixtures.

## Source material

- [Wydown repository](https://github.com/Dharklol/Wydown)
- [Canonical domain and arithmetic contract](https://github.com/Dharklol/Wydown/blob/53c23ae3b9d90166303232a8a11030a4a1fa74a8/docs/specs/001-domain-and-invariants.md)
- [Event envelope, journal and replay contract](https://github.com/Dharklol/Wydown/blob/53c23ae3b9d90166303232a8a11030a4a1fa74a8/docs/specs/002-events-and-ledger.md)
- [Storage and performance-unit accounting](https://github.com/Dharklol/Wydown/blob/53c23ae3b9d90166303232a8a11030a4a1fa74a8/docs/specs/003-storage-and-unav.md)
- [Bounded research infrastructure control plane](https://github.com/Dharklol/pi-controller)
