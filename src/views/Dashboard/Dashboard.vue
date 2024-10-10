<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-blue-500 text-white p-4">
      <h1 class="text-2xl">Dashboard</h1>
    </header>
    <div class="flex flex-1">
      <aside class="w-64 bg-white p-4 shadow-md">
        <nav>
          <ul>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Home</a>
            </li>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Profile</a>
            </li>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Settings</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main class="flex-1 p-4">
        <h2 class="text-xl font-bold mb-4">Welcome to the Dashboard</h2>
        <p>This is a simple dashboard layout using Vue 3 and Tailwind CSS.</p>
      </main>
    </div>
  </div>
</template>

<script setup></script>
