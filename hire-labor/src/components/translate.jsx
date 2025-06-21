import { useEffect, useState } from "react";

const TranslateWidget = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages:
                "as,bn,gu,hi,kn,ks,ml,mr,ne,or,pa,sd,ta,te,ur,sa,bo,mai,brx,sat,dz,doi,mni,kok,lus,kha,en",
              layout:
                window.google.translate.TranslateElement.InlineLayout.VERTICAL,
            },
            "google_translate_element"
          );
        }
      };

      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.googleTranslateElementInit) {
          window.googleTranslateElementInit(); // Execute after script loads
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      id="translate-container"
      style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}
    >
      <button
        id="translate-button"
        style={{
          padding: "10px",
          backgroundColor: "#2d457e",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
        onClick={() => setDropdownVisible(!isDropdownVisible)}
      >
        🌐 Translate
      </button>

      <div
        id="google_translate_element"
        style={{ display: isDropdownVisible ? "block" : "none" }}
      ></div>
    </div>
  );
};

export default TranslateWidget;
