<!-- ConfirmationModal.vue (After) -->
<template>
  <BaseModal :isOpen="isOpen" :title="title" @close="onCancel">
    <!-- Modal BODY -->
    <Paragraph :text="message" class="mb-4" />

    <!-- Modal FOOTER (slot="footer") -->
    <template #footer>
      <div class="flex space-x-4">
        <Button variant="secondary" @click="onCancel">Cancel</Button>
        <Button variant="danger" @click="onConfirm">Confirm</Button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/Atoms/BaseModal/BaseModal.vue'
import Paragraph from '@/components/Atoms/BaseParagraph/BaseParagraph.vue'
import Button from '@/components/Atoms/BaseButton/BaseButton.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: 'Confirm Action' },
  message: { type: String, required: true },
})
const emit = defineEmits(['confirm', 'cancel'])

function onConfirm() {
  emit('confirm')
}
function onCancel() {
  emit('cancel')
}
</script>
