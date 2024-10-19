<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-blue-500 text-white p-4">
      <h1 class="text-2xl">Campaigns</h1>
    </header>
    <div class="flex flex-1">
      <aside class="w-64 bg-white p-4 shadow-md">
        <nav>
          <ul>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Dashboard</a>
            </li>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Campaigns</a>
            </li>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Reports</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main class="flex-1 p-4">
        <h2 class="text-xl font-bold mb-4">Active Campaigns</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-white p-4 shadow-md rounded">
            <h3 class="text-lg font-bold mb-2">Campaign 1</h3>
            <p class="text-gray-700">Description of Campaign 1.</p>
          </div>
          <div class="bg-white p-4 shadow-md rounded">
            <h3 class="text-lg font-bold mb-2">Campaign 2</h3>
            <p class="text-gray-700">Description of Campaign 2.</p>
          </div>
          <div class="bg-white p-4 shadow-md rounded">
            <h3 class="text-lg font-bold mb-2">Campaign 3</h3>
            <p class="text-gray-700">Description of Campaign 3.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup></script>
