# 07. Migration Strategy & Proof-of-Concept Plan

## 1. Zero-Downtime Migration Architecture

To avoid breaking the live production website (`envintglobal.com` / `envintglobal.vercel.app`) while transitioning from the legacy block format to the dynamic page builder, the system utilizes a **dual-engine rendering protocol**:

```
                              Page Request
                                   │
                                   ▼
                      Read `published_blocks`
                                   │
                ┌──────────────────┴──────────────────┐
                ▼                                     ▼
        Schema Version 1                      Schema Version 2
       (Legacy Flat Blocks)                 (Dynamic Element Tree)
                │                                     │
                ▼                                     ▼
      Legacy Block Dispatcher              Recursive Tree Engine
    (about-hero, about-vision...)         (Section -> Container -> Node)
```

1. **Dual Renderer Support**:
   - `DynamicPageRenderer.tsx` detects whether a page payload is Version 1 (array of legacy blocks) or Version 2 (tree graph with `rootIds` and `nodes`).
   - If Version 1: executes legacy block components without change.
   - If Version 2: executes the new high-performance `TreeRenderer`.
2. **On-Demand Page-by-Page Migration**:
   - Pages are migrated one at a time.
   - Migrating `/about` does not touch or disrupt `/services`, `/impact`, or `/careers`.

---

## 2. Proof of Concept: Rebuilding the About Page (`/about`)

The About page will be the first page reconstructed using the dynamic builder to prove that:
- Content matches the authentic live website with 100% fidelity.
- **Section 2 ("About Envint")** is completely dynamic and editable without code changes.
- Every element can be selected, reordered, styled, deleted, or supplemented with new elements.

### The 5 Reconstructed Dynamic Sections of `/about`:

#### Section 1: Brand Hero Section
- **Node**: `section` (background: S3 image `about-hero.webp`, gradient overlay)
  - **Child**: `container` (max-width `1280px`, flex column, justify bottom, min-height `60vh`)
    - **Child**: `heading`
      - `tag`: `h1`
      - `text`: `"Our vision for the future is one that’s better"`
      - `styles`: `{ fontSize: '76px', textColor: '#FBF4EB', fontWeight: 400, fontFamily: 'Neue Montreal' }`
      - `responsiveStyles`: `{ tablet: { fontSize: '56px' }, mobile: { fontSize: '36px' } }`

#### Section 2: "About Envint" 2-Column Split
*(Replaces the rigid `about-vision` block and eliminates the hardcoded "Our Purpose" fallback)*
- **Node**: `section` (background: `#ffffff`, padding: `80px 24px 110px`)
  - **Child**: `container` (max-width `1280px`)
    - **Child**: `grid`
      - `gridColumns`: `"minmax(0, 480px) minmax(0, 1fr)"` (desktop), `"1fr"` (tablet/mobile)
      - `gap`: `"64px"`
      - **Left Column** (`container`):
        - **Child**: `heading`
          - `tag`: `h2`
          - `text`: `"About Envint"`
          - `styles`: `{ fontSize: '48px', textColor: '#004E35', fontWeight: 400 }`
          - `responsiveStyles`: `{ mobile: { fontSize: '28px' } }`
      - **Right Column** (`flex`, direction: column, gap: `24px`):
        - **Child 1**: `paragraph`
          - `html`: `"<p>Envint is a sustainability and ESG solutions firm, founded with a purpose to shape a more liveable planet for the coming generations.</p>"`
          - `styles`: `{ fontSize: '22px', lineHeight: '35px', textColor: '#393939' }`
        - **Child 2**: `paragraph`
          - `html`: `"<p>Our mission is to drive sustainability into mainstream thought and action, with the belief that ‘green makes sense beyond conscience’.</p>"`
          - `styles`: `{ fontSize: '22px', lineHeight: '35px', textColor: '#393939' }`
        - **Child 3**: `paragraph`
          - `html`: `"<p>We believe that by embedding environmental, social and governance principles in their core strategies, businesses can not only do good for the world, but also earn better financial returns.</p>"`
          - `styles`: `{ fontSize: '22px', lineHeight: '35px', textColor: '#393939' }`

#### Section 3: "How It All Began" (Founders Spotlight)
- **Node**: `section` (background: `#F7F7F7`, padding: `72px 24px 110px`)
  - **Child**: `container` (max-width `1220px`)
    - **Child**: `grid`
      - `gridColumns`: `"minmax(0, 520px) minmax(0, 1fr)"`
      - `gap`: `"70px"`
      - **Left Column** (`container`):
        - **Child**: `image`
          - `src`: `"https://envintcms.s3.ap-south-1.amazonaws.com/images/founders-anand-manish.webp"`
          - `alt`: `"Envint Co-Founders Anand Krishnamurthy and Manish R Jain"`
          - `styles`: `{ borderRadius: '15px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }`
      - **Right Column** (`container`, flex column):
        - **Child 1**: `heading` (`tag`: `h2`, `text`: `"How it all began"`, `styles`: `{ fontSize: '48px', textColor: '#004E35', marginBottom: '32px' }`)
        - **Child 2**: `paragraph` (`text`: `"A deep conviction to create an impact in the environment sector..."`)
        - **Child 3**: `paragraph` (`text`: `"Envint is a portmanteau of ‘environment’ and ‘intelligence’..."`)

#### Section 4: "Our Journey" Milestones
- **Node**: `section` (padding: `80px 24px`)
  - **Child**: `container`
    - **Child**: `heading` (`text`: `"Our Journey"`, `alignment`: `center`)
    - **Child**: `milestone-timeline` or dynamic card list (2018 to 2024 milestones)

#### Section 5: "A Team You’ll Be Proud to Call Your Own"
- **Node**: `section` (padding: `80px 24px`)
  - **Child**: `container`
    - **Child**: `heading` (`text`: `"A team you’ll be proud to call your own"`, `alignment`: `center`)
    - **Child**: `paragraph` (`text`: `"Our team is based across multiple locations in India..."`, `alignment`: `center`)
    - **Child**: `team-grid` (dynamically renders all 15 leadership & consultant cards from `team_members`)

---

## 3. What the Editor Can Do with the Reconstructed About Page

Once migrated to the dynamic tree model, an authorized editor can:
1. Change the heading from `"About Envint"` to `"About Us"` or `"Our Purpose"` directly on canvas or in the inspector.
2. Change the paragraph font size from `22px` to `18px` or `26px`.
3. Add a fourth paragraph or an author quote.
4. Add a `"Download Profile"` or `"Contact Us"` button directly below paragraph 3.
5. Move the Founders Photo to the right column and the text to the left column with drag-and-drop.
6. Change the background color of Section 2 from `#ffffff` to `#F8FAFC` or `#002E20`.
7. Hide Section 4 (Journey) on mobile devices with a single toggle.
8. Duplicate Section 2 to create an "Our Values" section with zero code changes.

---

## 4. Migration Plan for Remaining Pages

Following validation of the About page proof-of-concept, the remaining pages will be migrated using the same verified element tree format:

1. **Home (`/`)**: Hero, Philosophy statement, 4-stat counter, 3 practice pillars, dynamic insights grid, newsletter CTA.
2. **Services (`/services`)**: Hero banner, 3 practice area cards, 4 proprietary tools cards (EnvSaGe, EmCal, ADD, MapSense), sector cards grid, theme cards grid.
3. **Practice Pages (`/sustainability-integration`, `/climate-action`, `/responsible-investment`)**: Specialized heroes, offering cards, case study highlights.
4. **Impact (`/impact`)**: Impact hero, philosophy banner, dynamic case studies filter grid.
5. **Careers (`/careers-at-envint`)**: Culture hero, "The Envint Way" pillars, life at Envint photo gallery, active job openings.
6. **Connect (`/connect`)**: Office locations cards (Mumbai, Delhi, Bengaluru), interactive contact inquiry form.
7. **Campaign & Sub-Pages (`/connect-gbc2024`, `/mapsense`, `/esq`)**: Reconstructed with dynamic sections.
