import { TEST_MODE_TOKEN } from '../constants';
import { store } from '../store/store';

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


const trackGPTFunnel = (action: string, isTestMode: boolean = false) => {
  if (typeof window !== "undefined" && window.gtag) {
    const token = store.getState().token.value;
    
    let isTestModeChecked = false;
    if(isTestMode) {
      isTestModeChecked = true; // If provided, use the provided value
    } else {
      isTestModeChecked = token == TEST_MODE_TOKEN;
    }

    window.gtag("event", "gpt_funnel", {
      action,
      is_test_mode: isTestModeChecked,
    });
  }
};

const trackContactLink = (contactChannel: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    const token = store.getState().token.value;
    window.gtag("event", "contact_link", {
      contact_channel: contactChannel,
      is_test_mode: token == TEST_MODE_TOKEN,
    });
  }
};


export const ga = {
  trackGPTFunnel,
  trackContactLink,
};
