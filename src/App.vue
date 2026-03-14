<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Repair Management System</q-toolbar-title>
        <q-btn flat label="Public Form" to="/" />
        <q-btn flat label="Admin" to="/admin" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup></script>

