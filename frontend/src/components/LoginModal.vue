<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
                {{ $t('login.title') }}
            </h2>

            <form @submit.prevent="handleLogin">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-medium mb-2" for="email">
                        {{ $t('login.email') }}
                    </label>
                    <input
                        id="email"
                        v-model="email"
                        type="email"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :placeholder="$t('login.emailPlaceholder')"
                        required
                        :disabled="isLoading"
                    />
                </div>

                <div class="mb-6">
                    <label class="block text-gray-700 text-sm font-medium mb-2" for="password">
                        {{ $t('login.password') }}
                    </label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :placeholder="$t('login.passwordPlaceholder')"
                        required
                        :disabled="isLoading"
                    />
                </div>

                <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {{ errorMessage }}
                </div>

                <button
                    type="submit"
                    class="w-full bg-blue-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="isLoading"
                >
                    <span v-if="isLoading">{{ $t('login.loggingIn') }}</span>
                    <span v-else>{{ $t('login.submit') }}</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginModal',
    props: {
        apiService: {
            type: Object,
            required: true
        }
    },
    emits: ['login-success'],
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
            isLoading: false
        };
    },
    methods: {
        $t(key) {
            const translations = {
                en: {
                    'login.title': 'Login',
                    'login.email': 'Email',
                    'login.emailPlaceholder': 'Enter your email',
                    'login.password': 'Password',
                    'login.passwordPlaceholder': 'Enter your password',
                    'login.submit': 'Login',
                    'login.loggingIn': 'Logging in...',
                    'login.error': 'Invalid email or password'
                },
                pl: {
                    'login.title': 'Logowanie',
                    'login.email': 'Email',
                    'login.emailPlaceholder': 'Wprowadź email',
                    'login.password': 'Hasło',
                    'login.passwordPlaceholder': 'Wprowadź hasło',
                    'login.submit': 'Zaloguj',
                    'login.loggingIn': 'Logowanie...',
                    'login.error': 'Nieprawidłowy email lub hasło'
                }
            };
            const lang = localStorage.getItem('vnotes_language') || 'en';
            return translations[lang][key] || translations['en'][key] || key;
        },
        async handleLogin() {
            this.errorMessage = '';
            this.isLoading = true;

            try {
                const result = await this.apiService.login(this.email, this.password);
                if (result.success) {
                    this.$emit('login-success', result.user);
                }
            } catch (error) {
                this.errorMessage = error.message;
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

