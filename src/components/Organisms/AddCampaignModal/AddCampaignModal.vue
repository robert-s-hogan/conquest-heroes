<!-- AddCampaignModal.vue -->
<template>
  <BaseModal :isOpen="isOpen" title="Add New Campaign" @close="closeModal">
    <form @submit.prevent="handleSubmit" class="space-y-2">
      <div>
        <!-- Campaign Name -->
        <InputField
          v-model="campaignName"
          label="Campaign Name"
          placeholder="Enter campaign name"
        />
        <p v-if="errors.campaignName" class="text-red-600 text-sm -mt-3 mb-1">
          {{ errors.campaignName }}
        </p>
      </div>
      <div>
        <!-- Description -->
        <InputField
          v-model="description"
          label="Description"
          placeholder="Enter description"
        />
        <p v-if="errors.description" class="text-red-600 text-sm -mt-3 mb-1">
          {{ errors.description }}
        </p>
      </div>

      <div>
        <!-- Starting XP -->
        <InputField
          v-model="startXp"
          label="Starting Experience"
          type="number"
          placeholder="0"
        />
        <p v-if="errors.startXp" class="text-red-600 text-sm -mt-3 mb-1">
          {{ errors.startXp }}
        </p>
      </div>

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

// Props and emits
const props = defineProps({
  isOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit'])

// Form fields
const campaignName = ref('')
const description = ref('')
const startXp = ref(0)
const isSubmitting = ref(false)

// Errors object
const errors = ref({
  campaignName: '',
  description: '',
  startXp: '',
})

/**
 * Validate form fields and fill the errors object if any are invalid.
 * Return true if all fields are valid.
 */
function validateForm() {
  // Clear old errors
  errors.value = {
    campaignName: '',
    description: '',
    startXp: '',
  }

  let isValid = true

  if (!campaignName.value.trim()) {
    errors.value.campaignName = 'Campaign name is required.'
    isValid = false
  }
  if (!description.value.trim()) {
    errors.value.description = 'Description is required.'
    isValid = false
  }
  if (startXp.value === '' || startXp.value === null) {
    errors.value.startXp = 'Starting experience is required.'
    isValid = false
  } else if (startXp.value < 0) {
    errors.value.startXp = 'Starting experience cannot be negative.'
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  if (!validateForm()) return

  isSubmitting.value = true

  // Emit your new campaign data up to the parent
  emit('submit', {
    campaignName: campaignName.value,
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
  campaignName.value = ''
  description.value = ''
  startXp.value = 0
  errors.value = {
    campaignName: '',
    description: '',
    startXp: '',
  }
}
</script>
