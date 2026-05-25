# Review Log — 리뷰 결과 로그

## 0. 운영 규칙

- GPT는 구현 결과와 `WORK_LOG.md`를 기준으로 리뷰한다.
- 리뷰는 버그, 요구사항 누락, 아키텍처 위반, 테스트 공백을 우선한다.
- Critical은 반드시 보완 작업으로 되돌린다.
- Warning은 기능 완료를 막지 않는 경우 후속 작업으로 넘길 수 있다.

## 1. 리뷰 결과

---

## 2026-05-25 / Unit 1 — 릴리즈 도메인 모델과 mock 데이터

### 최종 판단

- PASS WITH WARNINGS

### Critical

- 없음

### Warning

1. `src/entities/index.ts`에서 layer-level barrel이 `export * from './release'`를 사용한다.
   - `src/entities/release/index.ts`는 명시적 public API를 제공하므로 현재 캡슐화 위반은 아니다.
   - 다만 슬라이스가 늘어나면 노출 범위 추적이 흐려질 수 있으므로, Unit 2 이후 entities layer barrel의 명시적 re-export 기준을 정하는 것을 권장한다.

2. `generateAnnouncement` 테스트가 MAJOR 섹션 텍스트와 config 동작은 검증하지만, MINOR 섹션의 텍스트 포맷은 직접 검증하지 않는다.
   - `minorItems` 데이터 분류는 검증되어 있어 현재 기능 완료를 막지는 않는다.
   - 공지문 포맷 회귀 방어를 위해 Unit 2 또는 Unit 4에서 MINOR 텍스트 케이스를 보강하는 것을 권장한다.

3. `TEST_STATUS`는 상수/타입 SSOT로 정의되어 있으나, 표시용 `TEST_STATUS_LABEL`은 아직 없다.
   - Unit 1 필수 범위에는 상태 상수/타입 정의가 포함되므로 Critical은 아니다.
   - Unit 2/Unit 5에서 QC 상태 배지를 표시할 때 `CHANGE_CATEGORY_LABEL`, `RELEASE_STATUS_LABEL`과 같은 패턴으로 추가하는 것이 좋다.

### 검증 결과

현재 repo 루트에서 재실행:

```bash
pnpm lint
```

- 결과: PASS

```bash
pnpm test
```

- 결과: PASS
- 상세: `src/entities/release/model/generateReleaseDocuments.test.ts` 22개 + `src/app/App.test.tsx` 1개, 총 23개 테스트 통과

```bash
pnpm typecheck
```

- 결과: PASS

```bash
pnpm build
```

- 결과: PASS
- 상세: `tsc -b && vite build`, 29 modules transformed

### 보완 요청

- Critical 없음. Unit 1 보완 작업은 필요 없다.
- Unit 2 진행 가능.

### 후속 권장 사항

- Unit 2에서는 새 라우팅 라이브러리 추가 없이 현재 의존성 범위에서 최소 라우팅을 구현할지 먼저 결정한다.
- 릴리즈 상세 탭 상태는 공유 가능한 URL 상태(hash/searchParams)로 둘지, Unit 2에서는 local state로 시작할지 결정한다.
- QC 상태 표시가 들어가는 시점에 `TEST_STATUS_LABEL` 추가 여부를 확정한다.

---

## 2026-05-25 / Unit 0 3차 검증 — repo 루트 pnpm 재검증

### 최종 판단

- PASS WITH WARNINGS

### Critical

- 없음

### Warning

1. `_tmp_6_*`, `vite/vitest timestamp mjs`, `tsconfig.*.tsbuildinfo` 산출물이 실제 파일로 남아 있다.
   - 현재 `.gitignore`에 포함되어 커밋 오염 위험은 낮다.
   - 가능하면 추후 사용자 머신에서 정리한다.

2. `AGENTS.template.md` 삭제가 worktree에 남아 있다.
   - Unit 0 스캐폴딩과 직접 관련 없는 변경일 수 있으므로 커밋 전 의도 확인이 필요하다.

3. test 파일 typecheck 전략은 아직 미확정이다.
   - Unit 1에서 순수 함수 테스트가 늘어나기 전 `tsconfig.vitest.json` 또는 테스트 포함 typecheck 전략을 결정하는 것을 권장한다.

4. `.npmrc`에서 hoisted linker와 `shamefully-hoist=true`를 유지하고 있다.
   - 현재 검증은 통과했다.
   - Unit 1 전에 isolated linker 전환 여부를 결정할 수 있으나, 프로토타입 단계에서는 유지 가능하다.

### 검증 결과

실제 repo 루트에서 실행:

```bash
pnpm lint
```

- 결과: PASS

```bash
pnpm test
```

- 결과: PASS
- 상세: `src/app/App.test.tsx` 1개 파일, 1개 테스트 통과

```bash
pnpm typecheck
```

- 결과: PASS

```bash
pnpm build
```

- 결과: PASS
- 상세: `tsc -b && vite build`, 29 modules transformed

### 보완 요청

- Unit 0 추가 보완은 필요 없다.
- Unit 1 진행 가능.

### 후속 권장 사항

- Unit 1 착수 전 `AGENTS.template.md` 삭제가 의도된 변경인지 확인한다.
- Unit 1에서 테스트 파일이 늘어나면 테스트 typecheck 전략을 다시 검토한다.

---

## 2026-05-25 / Unit 0 보완 — pnpm 환경 정상화 2차 리뷰

### 최종 판단

- NOT PASS

### Critical

1. 현재 repo 작업 디렉터리에서 `pnpm test`가 실패한다.
   - 실행 결과:
     ```bash
     pnpm test
     ```
     ```text
     Error: Cannot find module @rollup/rollup-darwin-arm64.
     npm has a bug related to optional dependencies.
     ```
   - 확인 내용:
     - `node_modules/@rollup/rollup-darwin-arm64` 디렉터리는 존재하지만 비어 있다.
     - 현재 `node_modules`가 npm fallback과 pnpm 설치가 섞인 오염 상태로 보인다.
   - 영향: Unit 0 완료 기준인 `pnpm test` 통과를 만족하지 못한다.
   - 보완 방향: 현재 repo 루트에서 `node_modules`와 `package-lock.json`을 실제로 삭제한 뒤 `pnpm install`을 다시 수행해야 한다.

2. 현재 repo 작업 디렉터리에서 `pnpm build`가 실패한다.
   - 실행 결과:
     ```bash
     pnpm build
     ```
     ```text
     error TS2688: Cannot find type definition file for 'react_tmp_6_2'.
     ```
   - 확인 내용:
     - `node_modules/@types/react_tmp_6_2`
     - `node_modules/react_tmp_6_3`
     - 위 임시/오염 패키지 디렉터리가 존재한다.
   - 영향: TypeScript 빌드가 현재 작업 디렉터리에서 재현 가능하게 통과하지 않는다.
   - 보완 방향: 오염된 `node_modules`를 삭제하고 pnpm 기준으로 재설치해야 한다.

3. 작업 루트에 임시/빌드 산출물이 여전히 실제 파일로 남아 있다.
   - 확인된 파일:
     - `_tmp_6_*`
     - `dist`
     - `package-lock.json`
     - `vite.config.ts.timestamp-*`
     - `vitest.config.ts.timestamp-*`
     - `tsconfig.*.tsbuildinfo`
   - 현재 `.gitignore`로 숨겨진 것은 좋지만, 완료 기준에는 “산출물이 제거되어 있다”가 포함되어 있다.
   - 영향: 현재 repo 상태가 깨끗하지 않고, 일부 산출물이 실제 검증 실패 원인과 연결되어 있다.
   - 보완 방향: 삭제 가능한 산출물은 삭제한다. 권한 문제로 삭제할 수 없다면 사용자 조치가 필요한 항목으로 명확히 남기고 Unit 0 PASS 여부는 보류한다.

### Warning

1. `.npmrc`에서 hoisted linker와 `shamefully-hoist=true`를 유지하고 있다.
   - 현재 검증 실패의 직접 원인은 hoisted 자체보다 오염된 `node_modules`로 보인다.
   - Unit 0에서는 유지 가능하나, Unit 1 전에 pnpm 기본 isolated linker로 갈지 결정하는 것이 좋다.

2. test 파일 typecheck 전략은 아직 미결정이다.
   - `tsconfig.app.json`에서 test/spec 파일이 제외되어 있다.
   - Unit 1에서 순수 함수 테스트가 늘어나기 전 `tsconfig.vitest.json` 또는 테스트 포함 typecheck 전략을 결정하는 것이 좋다.

3. `AGENTS.template.md` 삭제가 계속 worktree에 남아 있다.
   - Unit 0과 직접 관련 없는 변경일 수 있으므로 커밋 전 의도 확인이 필요하다.

### 검증 결과

실행 환경:

```bash
node -v
```

```text
v18.17.0
```

```bash
pnpm --version
```

```text
10.33.4
```

실행 결과:

| 명령 | 결과 | 비고 |
| --- | --- | --- |
| `pnpm lint` | PASS | ESLint 실행 통과 |
| `pnpm typecheck` | PASS | `tsc --noEmit` 통과 |
| `pnpm test` | FAIL | Rollup optional dependency 디렉터리 오염/누락 |
| `pnpm build` | FAIL | `react_tmp_6_2` 타입 디렉터리 오염 |

### 보완 요청

- Unit 0 2차 보완 작업을 진행한다.
- 현재 repo 루트에서 오염된 `node_modules`를 삭제하고 `pnpm install`을 다시 수행한다.
- `package-lock.json`, `dist`, `_tmp_6_*`, `vite/vitest timestamp mjs`, `tsconfig.*.tsbuildinfo`를 실제로 삭제한다.
- 삭제가 권한 문제로 불가능하면, 어떤 파일이 삭제되지 않았는지와 사용자 수동 조치 명령을 `WORK_LOG.md`에 남긴다.
- 보완 후 현재 repo 루트에서 `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build`를 다시 실행한다.

### 후속 권장 사항

- 클린 `/tmp` 환경 검증은 참고 자료로만 사용하고, Unit 완료 판정은 실제 repo 루트에서 실행한 검증 결과를 기준으로 한다.
- 현재 repo 루트에서 4개 pnpm 검증 명령이 모두 통과하기 전에는 Unit 1로 넘어가지 않는다.

---

## 2026-05-25 / Unit 0 — 프로젝트 스캐폴딩 리뷰

### 최종 판단

- NOT PASS

### Critical

1. `package.json:6` — `packageManager`가 `pnpm@11.3.0`으로 고정되어 현재 작업 환경의 Node.js `v18.17.0`에서 pnpm 명령이 실행되지 않는다.
   - 영향: `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build`가 모두 pnpm 실행 단계에서 실패한다.
   - 확인 결과:
     ```bash
     pnpm lint
     ```
     ```text
     ERROR: This version of pnpm requires at least Node.js v22.13
     The current version of Node.js is v18.17.0
     ```
   - 보완 방향: 현재 프로젝트가 Node 18 호환을 유지할지, Node 22.13 이상을 필수로 할지 결정해야 한다. 별도 결정이 없다면 Vite 6/React 19 프로토타입 기준으로 `pnpm@10` 계열을 사용해 현재 Node 18 환경에서도 검증 가능하게 맞춘다.

2. pnpm 프로젝트 기준 lockfile이 없다.
   - 영향: `packageManager`와 문서에서는 pnpm 사용을 명시했지만 `pnpm-lock.yaml`이 없어 의존성 재현성이 없다.
   - 보완 방향: npm fallback 결과물인 `package-lock.json`/`node_modules`를 정리한 뒤 `pnpm install`로 `pnpm-lock.yaml`을 생성한다.

3. 작업 루트에 빌드/테스트 임시 산출물이 untracked 상태로 남아 있다.
   - 대상:
     - `_tmp_6_*`
     - `vitest.config.ts.timestamp-*.mjs`
     - `vite.config.ts.timestamp-*.mjs`
     - `dist`
     - `package-lock.json`
   - 영향: 커밋 전 작업 범위와 산출물이 섞이고, 이후 리뷰/커밋에서 불필요한 파일이 포함될 위험이 있다.
   - 보완 방향: 산출물을 삭제하거나 `.gitignore`에 필요한 패턴을 추가한다. 단, `pnpm-lock.yaml`은 생성 후 커밋 대상이어야 한다.

### Warning

1. `eslint.config.js:5` — `globals` 패키지를 직접 import하지만 `package.json`의 `devDependencies`에 명시되어 있지 않다.
   - 영향: 현재 `.npmrc`의 hoisting 설정 또는 npm fallback 환경에서는 통과할 수 있지만, pnpm 기본 strict 의존성 관점에서는 직접 의존성을 명시하는 편이 안전하다.
   - 보완 방향: `globals`를 `devDependencies`에 추가한다.

2. `tsconfig.app.json:28` — test/spec 파일이 app typecheck 대상에서 제외되어 있다.
   - 영향: `pnpm typecheck`가 테스트 파일 타입 오류를 잡지 못할 수 있다.
   - 보완 방향: Unit 0에서는 별도 보완 필수는 아니지만, `tsconfig.vitest.json` 또는 테스트 포함 typecheck 전략을 Unit 1 이전에 결정하는 것을 권장한다.

3. `.npmrc` — `node-linker=hoisted`, `shamefully-hoist=true`가 sandbox 대응 목적으로 추가되어 있다.
   - 영향: pnpm 기본 node linker와 다르므로 실제 프로젝트 운영 방식과 다를 수 있다.
   - 보완 방향: 현재 환경에서 꼭 필요한지 확인하고, 불필요하면 제거한다. 유지할 경우 이유를 문서화한다.

4. `AGENTS.template.md` 삭제가 worktree에 남아 있다.
   - 영향: Unit 0 범위와 직접 관련 없는 변경일 수 있다.
   - 보완 방향: 의도된 삭제인지 확인 후 커밋 범위에 포함하거나 복구한다.

### 검증 결과

실행 환경:

```bash
node -v
```

```text
v18.17.0
```

pnpm 기준 검증:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

- 결과: 모두 실패
- 실패 원인: `pnpm@11.3.0`이 Node.js `v22.13` 이상을 요구한다.

npm fallback 기반 직접 실행 확인:

```bash
./node_modules/.bin/eslint .
./node_modules/.bin/tsc --noEmit
node node_modules/vitest/vitest.mjs run
./node_modules/.bin/tsc -b
```

- `eslint`: PASS
- `tsc --noEmit`: PASS
- `vitest`: FAIL
  - npm optional dependency 이슈로 `@rollup/rollup-darwin-arm64`를 찾지 못함
- `tsc -b`: FAIL
  - sandbox 권한으로 `tsconfig.*.tsbuildinfo` 쓰기 실패

### 보완 요청

- Unit 0 보완 작업을 먼저 진행한다.
- `packageManager`와 Node 버전 정책을 정리한다.
- pnpm 기반 설치/lockfile/검증이 가능한 상태로 맞춘다.
- untracked 임시 산출물을 정리한다.
- `globals` 직접 의존성을 명시한다.
- 보완 후 `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build` 결과를 다시 기록한다.

### 후속 권장 사항

- Unit 0이 PASS 되기 전에는 Unit 1로 넘어가지 않는다.
- 테스트 파일 typecheck 전략은 Unit 1 시작 전 또는 Unit 1에서 순수 함수 테스트를 작성하기 전에 확정한다.

---

## YYYY-MM-DD / Unit X — 리뷰 대상

### 최종 판단

- TODO: PASS / PASS WITH WARNINGS / NOT PASS

### Critical

- TODO: 없으면 "없음"으로 기록한다.

### Warning

- TODO: 없으면 "없음"으로 기록한다.

### 검증 결과

- TODO

### 보완 요청

- TODO

### 후속 권장 사항

- TODO
