declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params: {
        [key: string]: any;
      }
    ) => void;
  }
}

const trackPageView = (pagePath: string, pageTitle: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: `${window.location.pathname}${pagePath}`, // Only the path
        page_title: pageTitle, // Optional but recommended
      });
    }
  };

const trackGPTFunnel = (action: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "gpt_funnel", {
      action,
    });
  }
};

const trackContactLink = (contactChannel: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "contact_link", {
      contact_channel: contactChannel,
    });
  }
};


export const ga = {
  trackPageView,
  trackGPTFunnel,
  trackContactLink,
};
