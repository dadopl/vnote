// i18n plugin for Vue - provides translation functionality
import { translations } from './translations.js';

const SUPPORTED_LANGUAGES = ['en', 'pl'];
const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'vnotes_language';

/**
 * Get nested value from object using dot notation
 * @param {Object} obj - Object to search
 * @param {string} path - Dot-separated path (e.g., 'header.title')
 * @returns {*} Value at path or undefined
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
}

/**
 * Get current language from localStorage or return default
 * @returns {string} Language code ('en' or 'pl')
 */
export function getStoredLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
        return stored;
    }
    return DEFAULT_LANGUAGE;
}

/**
 * Save language to localStorage
 * @param {string} lang - Language code to save
 */
export function setStoredLanguage(lang) {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
        localStorage.setItem(STORAGE_KEY, lang);
    }
}

/**
 * Create translation function for specific language
 * @param {string} lang - Language code
 * @returns {Function} Translation function
 */
export function createTranslator(lang) {
    const language = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
    const langTranslations = translations[language];

    /**
     * Translate key to current language
     * @param {string} key - Translation key (supports dot notation)
     * @param {Object} params - Optional parameters for interpolation
     * @returns {string} Translated string or key if not found
     */
    return function t(key, params = {}) {
        let value = getNestedValue(langTranslations, key);

        // Fallback to default language if not found
        if (value === undefined && language !== DEFAULT_LANGUAGE) {
            value = getNestedValue(translations[DEFAULT_LANGUAGE], key);
        }

        // Return key if still not found
        if (value === undefined) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }

        // Handle interpolation (e.g., "Hello {name}")
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
                return params[paramKey] !== undefined ? params[paramKey] : match;
            });
        }

        return value;
    };
}

/**
 * i18n mixin for Vue components
 * Provides this.t() method and this.currentLanguage
 */
export const i18nMixin = {
    data() {
        return {
            currentLanguage: getStoredLanguage()
        };
    },
    computed: {
        /**
         * Translation function bound to current language
         */
        t() {
            return createTranslator(this.currentLanguage);
        }
    },
    methods: {
        /**
         * Change current language
         * @param {string} lang - New language code
         */
        setLanguage(lang) {
            if (SUPPORTED_LANGUAGES.includes(lang)) {
                this.currentLanguage = lang;
                setStoredLanguage(lang);
            }
        }
    },
    watch: {
        currentLanguage(newLang) {
            setStoredLanguage(newLang);
        }
    }
};

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE };
export default {
    translations,
    createTranslator,
    getStoredLanguage,
    setStoredLanguage,
    i18nMixin,
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE
};

