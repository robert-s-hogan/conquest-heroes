<!-- AddCampaignModal.vue (After) -->
<template>
  <BaseModal :isOpen="isOpen" title="Add New Campaign" @close="closeModal">
    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="name"
        label="Campaign Name"
        placeholder="Enter campaign name"
      />
      <InputField
        v-model="description"
        label="Description"
        placeholder="Enter description"
      />
      <InputField
        v-model="startXp"
        label="Starting Experience"
        type="number"
        placeholder="0"
      />

      <Button :loading="isSubmitting" variant="primary" class="w-full mt-4">
        Add Campaign
      </Button>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import InputField from '@/components/Atoms/BaseInput/BaseInput.vue'
import BaseModal from '@/components/Atoms/BaseModal/BaseModal.vue'
import Button from '@/components/Atoms/BaseButton/BaseButton.vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit'])

const name = ref('')
const description = ref('')
const startXp = ref(0)
const isSubmitting = ref(false)

function handleSubmit() {
  isSubmitting.value = true
  // Emit the form payload
  emit('submit', {
    name: name.value,
    description: description.value,
    startXp: startXp.value,
  })
  isSubmitting.value = false
  closeModal()
}

function closeModal() {
  emit('close')
  resetForm()
}

function resetForm() {
  name.value = ''
  description.value = ''
  startXp.value = 0
}
</script>
