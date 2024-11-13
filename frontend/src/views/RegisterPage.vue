<!-- src/views/RegisterPage.vue -->
<template>
  <v-container>
    <h2>Регистрация</h2>
    <v-form @submit.prevent="onSubmit">
      <v-text-field
        label="Имя"
        v-model="name"
        :rules="[rules.required]"
      ></v-text-field>
      <v-text-field
        label="Email"
        v-model="email"
        :rules="[rules.required, rules.email]"
      ></v-text-field>
      <v-text-field
        label="Пароль"
        v-model="password"
        :rules="[rules.required, rules.min(6)]"
        type="password"
      ></v-text-field>
      <v-btn type="submit" color="primary">Зарегистрироваться</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  name: 'RegisterPage',
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const toast = useToast();

    const rules = {
      required: (value) => !!value || 'Обязательное поле',
      email: (value) => /.+@.+\..+/.test(value) || 'Некорректный email',
      min: (min) => (value) => value.length >= min || `Минимум ${min} символов`,
    };

    const onSubmit = async () => {
      try {
        await axios.post('http://localhost:5001/auth/register', {
          name: name.value,
          email: email.value,
          password: password.value,
        });
        toast.success('Регистрация успешна! Проверьте вашу электронную почту для MFA кода.');
        router.push({ name: 'VerifyMFAPage', query: { email: email.value } });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Ошибка регистрации');
      }
    };

    return { name, email, password, rules, onSubmit };
  },
};
</script>
