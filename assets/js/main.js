(function () {
  "use strict";

  const language = document.documentElement.lang === "eu" ? "eu" : "es";
  const messages = {
    eu: {
      copied: "Esteka kopiatu da. Instagramen itsats dezakezu.",
      copyPrompt: "Kopiatu esteka hau partekatzeko:",
      manualPrompt: "Ezin izan da automatikoki kopiatu. Kopiatu esteka hau:",
      prepared: "Esteka kopiatzeko prest dago.",
      shared: "Edukia partekatu da.",
      manual: "Kopiatu erakutsitako esteka eskuz."
    },
    es: {
      copied: "Enlace copiado. Ya puedes pegarlo en Instagram.",
      copyPrompt: "Copia este enlace para compartirlo:",
      manualPrompt: "No se pudo copiar automáticamente. Copia este enlace:",
      prepared: "Enlace preparado para copiar.",
      shared: "Contenido compartido.",
      manual: "Copia manualmente el enlace mostrado."
    }
  };

  const copy = messages[language];
  const status = document.querySelector("#share-status");
  const shareLinks = document.querySelectorAll("[data-share-x][data-share-target]");
  const shareButtons = document.querySelectorAll("[data-share-button][data-share-target]");

  function getShareData(control) {
    const targetId = control.dataset.shareTarget;
    const target = document.getElementById(targetId);
    const heading = target
      ? target.querySelector("h3") || target.querySelector("h1") || target.querySelector("h2")
      : null;
    const caption = target ? target.querySelector("figcaption > span:first-child") : null;
    const title = (heading || caption)?.textContent.trim() || document.title;
    const url = new URL(window.location.href);

    url.hash = targetId;

    return { title, url: url.href };
  }

  function announce(message) {
    if (status) {
      status.textContent = message;
    }
  }

  shareLinks.forEach(function (link) {
    const data = getShareData(link);
    const intent = new URL("https://x.com/intent/tweet");

    intent.searchParams.set("text", data.title);
    intent.searchParams.set("url", data.url);
    link.href = intent.href;
  });

  shareButtons.forEach(function (button) {
    button.hidden = false;

    button.addEventListener("click", async function () {
      const data = getShareData(button);
      button.disabled = true;

      try {
        if (typeof navigator.share === "function") {
          await navigator.share({
            title: data.title,
            text: data.title,
            url: data.url
          });
          announce(copy.shared);
        } else if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(data.url);
          announce(copy.copied);
        } else {
          window.prompt(copy.copyPrompt, data.url);
          announce(copy.prepared);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          window.prompt(copy.manualPrompt, data.url);
          announce(copy.manual);
        }
      } finally {
        button.disabled = false;
      }
    });
  });
})();
