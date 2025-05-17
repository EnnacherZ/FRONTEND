import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ForceReloadOnLinkChange: React.FC = () => {
  const location = useLocation();
  const previousLocation = useRef(location);

  useEffect(() => {
    // Vérifier si la location a vraiment changé
    if (previousLocation.current.pathname !== location.pathname) {
      // Force le rechargement si le chemin de l'URL a changé
      window.location.reload();
    }

    // Mettre à jour la référence à la nouvelle location après le rechargement
    previousLocation.current = location;
    window.scrollTo(0,0)
  }, [location]); // Le hook s'exécute chaque fois que la location change

  return null;
};

export default ForceReloadOnLinkChange;
