{
  description = "Product Feedback App dev shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    # Pinned to the last nixpkgs revision with Playwright 1.57.0, which must
    # match @playwright/test in package-lock.json. Bump both together.
    nixpkgs-playwright.url = "github:NixOS/nixpkgs/145b67bd0bd4e075f981c1c2b81155d9e2982de2";
  };

  outputs =
    { nixpkgs, nixpkgs-playwright, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system);
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          playwright = nixpkgs-playwright.legacyPackages.${system}.playwright-driver;
        in
        {
          default = pkgs.mkShell {
            packages = [ pkgs.nodejs_24 ];

            # sass-embedded ships a dynamically linked Dart binary that NixOS
            # can't run; make the Angular build use the pure-JS sass package.
            NG_BUILD_SASS_EMBEDDED = "0";

            PLAYWRIGHT_BROWSERS_PATH = "${playwright.browsers}";
            PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";

            # A globally exported LD_LIBRARY_PATH can inject libraries built
            # against a newer glibc than the pinned Playwright browsers use.
            shellHook = ''
              unset LD_LIBRARY_PATH
            '';
          };
        }
      );
    };
}
