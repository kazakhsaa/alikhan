<!-- src/views/VerifyMFAPage.vue -->
<template>
  <v-container>
    <h2>Верификация MFA</h2>
    <v-form @submit.prevent="onSubmit">
      <v-text-field
        label="Email"
        v-model="email"
        readonly
      ></v-text-field>
      <v-text-field
        label="Код MFA"
        v-model="code"
        :rules="[rules.required]"
      ></v-text-field>
      <v-btn type="submit" color="primary">Подтвердить</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';

export default {
  name: 'VerifyMFAPage',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();
    const store = useStore();

    const email = ref(route.query.email || '');
    const code = ref('');

    const rules = {
      required: (value) => !!value || 'Обязательное поле',
    };

    const onSubmit = async () => {
      try {
        const response = await axios.post('http://localhost:5001/auth/verify-mfa', {
          email: email.value,
          code: code.value,
        });
        const token = response.data.token;
        store.commit('auth/SET_TOKEN', token);
        await store.dispatch('auth/fetchUser');
        router.push({ name: 'HomePage' });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Ошибка верификации MFA');
      }
    };

    return { email, code, rules, onSubmit };
  },
};
</script>
