<!-- src/components/UserRegister.vue -->
<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div>
        <label>Name:</label>
        <input v-model="name" type="text" />
        <div v-if="v$.name.$error">
          <span v-if="!v$.name.required">Name is required.</span>
        </div>
      </div>
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" />
        <div v-if="v$.email.$error">
          <span v-if="!v$.email.required">Email is required.</span>
          <span v-if="!v$.email.email">Email must be valid.</span>
        </div>
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" />
        <div v-if="v$.password.$error">
          <span v-if="!v$.password.required">Password is required.</span>
          <span v-if="!v$.password.minLength">Password must be at least 6 characters.</span>
        </div>
      </div>
      <button type="submit">Register</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';

export default {
  name: 'UserRegister',
  setup() {
    const store = useStore();
    const router = useRouter();

    const state = reactive({
      name: '',
      email: '',
      password: '',
      error: '',
    });

    const rules = {
      name: { required },
      email: { required, email },
      password: { required, minLength: minLength(6) },
    };

    const v$ = useVuelidate(rules, state);

    const register = async () => {
      v$.$touch(); // Вызов метода $touch для проверки всех полей
      if (v$.$invalid) {
        return; // Если форма невалидна, не продолжать регистрацию
      }
      try {
        await store.dispatch('register', {
          name: state.name,
          email: state.email,
          password: state.password,
        });
        router.push('/dashboard'); // Перенаправление на dashboard после успешной регистрации
      } catch (err) {
        state.error = 'Registration failed. Please check your details.';
      }
    };

    return {
      ...state,
      v$,
      register,
    };
  },
};
</script>

<style>
/* Добавьте стили по необходимости */
</style>
