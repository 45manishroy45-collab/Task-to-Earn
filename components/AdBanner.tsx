import React, { useEffect, useRef } from 'react';

const AdBanner: React.FC = () => {
    const adContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const adContainer = adContainerRef.current;
        // Only append scripts if the container is empty to prevent duplicates on re-renders
        if (adContainer && adContainer.children.length === 0) {
            const scriptContainer = document.createElement('div');
            
            const configScript = document.createElement('script');
            configScript.type = 'text/javascript';
            // Using template literal to safely insert the script content
            configScript.innerHTML = `
                atOptions = {
                    'key' : '1ba451b3f3e81b21885fba94fa3f5859',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                };
            `;
            scriptContainer.appendChild(configScript);

            const adScript = document.createElement('script');
            adScript.type = 'text/javascript';
            adScript.src = '//www.highperformanceformat.com/1ba451b3f3e81b21885fba94fa3f5859/invoke.js';
            adScript.async = true;
            scriptContainer.appendChild(adScript);
            
            adContainer.appendChild(scriptContainer);
        }
    }, []);

    return (
        <div 
            className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-[50px] bg-gray-900 flex items-center justify-center z-50 border-b border-gray-700"
        >
           <div ref={adContainerRef} className="flex items-center justify-center">
                {/* The ad script will populate this div */}
           </div>
        </div>
    );
};

export default AdBanner;
