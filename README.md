# LensPub.xyz

[On PolyScan Mumbai](https://mumbai.polygonscan.com/address/0x554C6E9Ee31bbE1DdB06312F0440f582Cb54bee9#code)

> “a piece of knowledge, unlike a piece of physical property, can be shared by large groups of people without making anybody poorer.” - Aaron Swartz

---

## Overview

Lens Pub is a comunity driven permissionless publishing platform build on Len, Polygon and The Graph.

- Researcher reputation is their H Index.
- H index is the number of papers publihsed where the paper is cited more times that the number of papers published.
- Any researcher can post a paper.
- The paper is only considered published after it has been accepted (lens comments and call data) by more than four other researchers with a H index greater than two.
- Researchers' H index are calculated on read.

## Backend

The backend is a solidity contract, managed by the HardHat framework, that implements the lens Reference Mode interface. Contains the state and logice for publishing and reviewing papers. As persits the relationships between papers, researchers and other papers.

## The Graph

The Sub Graph indexes Researchers, Papers and Reviews.
[The Sub Graph](https://thegraph.com/hosted-service/subgraph/mdeisen/re-search)

## Frontend

Nextjs App
