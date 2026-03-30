# Pokémon Catcher - Cooperative Game Blueprint

## Overview

This document outlines the plan to create a two-player cooperative Pokémon-themed game. Players will work together to hit Pokémon targets with a Pokéball.

## Plan

1.  **Update `blueprint.md`:** Reflect the new cooperative Pokémon game concept.
2.  **Modify `index.html`:**
    *   Change the title to "Pokémon Catcher".
    *   Add hidden image elements for the Pokéball and target Pokémon to be used in the canvas.
3.  **Modify `style.css`:**
    *   Add a Pokémon-themed background and update styles for a cooperative feel.
4.  **Create `game.js` (replacing `pong.js`):**
    *   Implement cooperative game logic.
    *   Players control two paddles at the bottom of the screen.
    *   A Pokéball will be used to hit Pokémon targets.
    *   The score increases for each Pokémon captured.
    *   If the Pokéball falls, players lose a life.
5.  **Delete `pong.js`:** Remove the old competitive game file.
6.  **Update `index.html`:** Link to the new `game.js` file.
