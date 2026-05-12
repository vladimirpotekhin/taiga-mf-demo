import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="home">
      <div class="hero">
        <span class="badge">Host v4 · Taiga UI v4</span>
        <h1>Taiga UI Microfrontends</h1>
        <p>
          A playground for testing how different major versions of Taiga UI
          coexist on a single page via Module Federation.
        </p>
      </div>

      <div class="grid">
        <a class="card card--v4" routerLink="/remoteV4">
          <h2>Remote v4</h2>
          <p>Microfrontend on Taiga UI v4</p>
        </a>
        <a class="card card--v5" routerLink="/remoteV5">
          <h2>Remote v5</h2>
          <p>Microfrontend on Taiga UI v5</p>
        </a>
        <a class="card card--mix" routerLink="/both">
          <h2>Both</h2>
          <p>v4 and v5 side by side — hunting conflicts</p>
        </a>
      </div>

      <div class="note">
        Scenario: <strong>host runs v4</strong>, gradual migration in progress —
        some remotes are already on v5. Watching how styles, DI and overlays mix.
      </div>
    </section>
  `,
  styles: [`
    .home {
      max-width: 880px;
      margin: 0 auto;
      padding: 48px 24px 64px;
      color: #1a1a1a;
    }
    .hero { margin-bottom: 40px; }
    .hero h1 {
      margin: 12px 0 12px;
      font-size: 40px;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .hero p {
      margin: 0;
      font-size: 18px;
      line-height: 1.55;
      color: #555;
      max-width: 640px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      background: #e3f2fd;
      color: #1976d2;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.02em;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .card {
      display: block;
      padding: 20px 22px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      background: #fff;
      color: inherit;
      text-decoration: none;
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    }
    .card h2 {
      margin: 0 0 6px;
      font-size: 18px;
      font-weight: 600;
    }
    .card p {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
    }
    .card--v4:hover { border-color: #1976d2; }
    .card--v4 h2 { color: #1976d2; }
    .card--v5:hover { border-color: #7b1fa2; }
    .card--v5 h2 { color: #7b1fa2; }
    .card--mix:hover { border-color: #444; }
    .note {
      padding: 14px 18px;
      border-left: 3px solid #1976d2;
      background: #f0f7fc;
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.6;
      color: #444;
    }
  `],
})
export class Home {}
