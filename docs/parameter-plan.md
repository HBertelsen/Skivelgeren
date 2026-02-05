# Plan: Parametre for skianbefaling

Denne planen beskriver **alle parametre som lagres per ski** i katalogen (`data/skis.ts`) og hvordan de kobles til **spørreundersøkelsen**, slik at vi kan velge mest mulig riktig ski til brukeren.

---

## 1. Parametre som lagres på hver ski (katalogdata)

### 1.1 Identifikasjon og visning (har vi)
| Parameter   | Type     | Beskrivelse                    | Eksempel        |
|------------|----------|--------------------------------|-----------------|
| `id`       | string   | Unik ID                        | `"atomic-bent-100-25-26"` |
| `brand`    | string   | Merke                           | `"Atomic"`       |
| `model`    | string   | Modellnavn                     | `"Bent 100"`     |
| `season`   | string   | Sesong                         | `"2025-2026"`    |
| `category` | enum     | Hovedkategori                  | `"piste"` \| `"all-mountain"` \| `"freeride"` |
| `image`    | string   | Bilde-URL                      | `"/images/skis/..."` |

### 1.2 Geometri og fysiske mål (har vi delvis)
| Parameter   | Type     | Beskrivelse                    | Bruk i matching        |
|------------|----------|--------------------------------|-------------------------|
| `waistMm`  | number   | Midtbredde (mm)               | Terreng: piste = smal, pudder = bred |
| `radiusM`  | number   | Svingradius (m)               | Svar «svinger»: korte vs lange |
| **`lengthsCm`** | number[] | Tilgjengelige lengder (cm)  | **NYTT** – anbefale lengde ut fra brukerens høyde/vekt |

### 1.3 Nivå og brukertype (har vi)
| Parameter | Type   | Beskrivelse                         | Bruk i matching     |
|----------|--------|-------------------------------------|---------------------|
| `level`  | 1–5    | Anbefalt kjørenivå (1=nybegynner, 5=ekspert) | Spørsmål «Hvor god er du?» – ikke anbefal for vanskelig ski |

### 1.4 Profil-scorer 0–10 (har vi)
| Parameter     | Beskrivelse                    | Spørreundersøkelsen kobles til        |
|---------------|--------------------------------|----------------------------------------|
| `stability`   | Stabilitet i fart / hard kjøring | «Kjørestil»: hard → høy, avslappet → lavere |
| `playful`     | Lekenhet, smidighet            | «Kjørestil»: avslappet → høy, hard → lavere |
| `carvingGrip` | Kantgrep på piste              | «Terreng»: preparert → høy, pudder → lavere |
| `floatPow`    | Flyt i løssnø                  | «Terreng»: pudder → høy, piste → lavere |

### 1.5 Parametre vi bør legge til

| Parameter   | Type     | Beskrivelse                    | Hvorfor |
|------------|----------|--------------------------------|---------|
| **`design`** | enum   | Målgruppe for design          | Spørsmål «Design»: dame/herre/junior – filtrere/favorisere riktig design |
| **`useTypes`** | enum[] | Typer bruk skien er laget for | Spørsmål «Type alpinski» (bakke/park/topptur/allmountain) – bedre match |

Forslag til verdier:

- **`design`**: `"unisex"` \| `"men"` \| `"women"` \| `"junior"`  
  - De fleste ski er unisex; noen har dedikerte dame/junior-modeller.

- **`useTypes`**: array av `"piste"` \| `"park"` \| `"touring"` \| `"allmountain"`  
  - Eksempel: park-ski → `["park", "allmountain"]`, topptur → `["touring", "allmountain"]`, ren piste → `["piste"]`.

---

## 2. Kobling: spørreundersøkelse → ski-parametre

| Spørsmål (survey)      | Lagres som (quiz/svar) | Ski-parametre som brukes i matching |
|------------------------|------------------------|-------------------------------------|
| Hvilket design?        | `design`               | **`design`** (ny) – filtrer/vekt    |
| Hvor god er du?        | `level`                | **`level`** – ikke for vanskelig    |
| Hvor på fjellet?       | `terrain`              | **`category`**, **`waistMm`**, **`carvingGrip`**, **`floatPow`** |
| Hvordan kjørestil?     | `style`                | **`stability`**, **`playful`**      |
| Hvordan svinger?       | `turns`                | **`radiusM`**, **`carvingGrip`**    |
| Type alpinski (bakke/park/topptur/allmountain) | `type` | **`useTypes`** (ny) – vekt/filter |
| (Fremtidig) Høyde/vekt | `about.heightCm`, `about.weightKg` | **`lengthsCm`** (ny) – anbefalt lengde |

---

## 3. Anbefalingslogikk (kort)

1. **Filtrering (valgfritt)**  
   - `design`: ekskluder ski som er tydelig feil (f.eks. junior for voksen).  
   - `useTypes`: ekskluder ski som ikke har brukerens valgte type (f.eks. bare piste når de vil ha park).

2. **Scoring (som i dag, utvidet)**  
   - Terreng → vekt på `carvingGrip`, `floatPow`, `waistMm`, `category`.  
   - Kjørestil → vekt på `stability`, `playful`.  
   - Svinger → vekt på `radiusM`, `carvingGrip`.  
   - Nivå → straff hvis `ski.level` > brukerens nivå.  
   - Design → bonus hvis `ski.design` matcher brukerens `design` (eller unisex).  
   - Type bruk → bonus hvis brukerens `type` finnes i `ski.useTypes`.

3. **Lengde (når vi har høyde/vekt og `lengthsCm`)**  
   - Regn ut anbefalt lengde ut fra høyde (og evt. vekt), velg nærmeste tilgjengelige i `lengthsCm`, vis på resultat-siden.

---

## 4. Oppsummert: Nye felt per ski

| Felt          | Type       | Påkrevd | Standard / kommentar |
|---------------|------------|--------|-----------------------|
| `design`      | enum       | Ja     | `"unisex"` for de fleste |
| `useTypes`    | enum[]     | Ja     | Minst én: `["piste"]`, `["allmountain"]`, etc. |
| `lengthsCm`   | number[]   | Nei (men anbefalt) | F.eks. `[156, 164, 172, 180, 188]` for lengdeanbefaling |

Eksisterende felt beholdes; **`design`** og **`useTypes`** er de som må inn i datamodellen og i anbefalingslogikken for å bruke alle spørsmålene vi har i dag.

---

## 5. Neste steg (implementering)

1. **Utvid `SkiModel` i `data/skis.ts`** med `design` og `useTypes` (og evt. `lengthsCm`).  
2. **Fyll ut verdier** for alle ski i katalogen.  
3. **Oppdater `lib/recommend.ts`** (preferencesFromAnswers + scoring) til å bruke `design` og `useTypes`.  
4. **Valgfritt:** Legg til spørsmål om høyde/vekt og bruk `lengthsCm` til lengdeanbefaling på resultat-siden.

Når dette er på plass, hentes alle parametrene opp fra katalogdata når spørreundersøkelsen er ferdig, og anbefalingen blir mer treffsikker.
