<!-- src/views/LoginPage.vue -->
<template>
  <v-container>
    <h2>Вход</h2>
    <v-form @submit.prevent="onSubmit">
      <v-text-field
        label="Email"
        v-model="email"
        :rules="[rules.required, rules.email]"
      ></v-text-field>
      <v-text-field
        label="Пароль"
        v-model="password"
        :rules="[rules.required]"
        type="password"
      ></v-text-field>
      <v-btn type="submit" color="primary">Войти</v-btn>
    </v-form>
    <v-btn color="red" @click="handleGoogleLogin">Войти через Google</v-btn>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  name: 'LoginPage',
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const toast = useToast();

    const rules = {
      required: (value) => !!value || 'Обязательное поле',
      email: (value) => /.+@.+\..+/.test(value) || 'Некорректный email',
    };

    const onSubmit = async () => {
      try {
        await axios.post('http://localhost:5001/auth/login', {
          email: email.value,
          password: password.value,
        });
        toast.success('MFA код отправлен на вашу электронную почту.');
        router.push({ name: 'VerifyMFAPage', query: { email: email.value } });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Ошибка входа');
      }
    };

    const handleGoogleLogin = () => {
      window.location.href = 'http://localhost:5001/auth/google';
    };

    return { email, password, rules, onSubmit, handleGoogleLogin };
  },
};
</script>
