import { createContext } from 'react';

const defaultConfig = {
  backendUrl: "http://localhost:3600",
  logoSvg: undefined,
  logoAltText: "Logo",
}

const ConfigContext = createContext({config: {}});

export const getConfigurationContext = (configuration) => {
  const config = {...defaultConfig, configuration};
  return [ConfigContext.Provider, config]
}

export const useGetConfig = () => {
  const config = useContext(ConfigContext);
  return {
    ...config,
    backend_url: config.backendUrl + "/api/v1/",
    backend_url_v2: config.backendUrl + "/api/v2/",
  }
}