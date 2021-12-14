let logoSvg = undefined;
let logoAltText = "Logo";

let backendUrl = "localhost:3000"

export const configure = ({
  logoSvg : newLogoSvg, logoAltText : newLogoAltText,
  backendUrl : newBackendUrl,
}) => {
  logoSvg = newLogoSvg ? newLogoSvg : logoSvg;
  logoAltText = newLogoAltText ? newLogoAltText : logoAltText;
  backendUrl = newBackendUrl ? newBackendUrl : backendUrl;
}

export const getConfig = () => ({
  logoSvg, logoAltText, backendUrl,
  backend_url: backendUrl + "/api/v1/",
  backend_url_v2: backendUrl + "/api/v2/",
});