<!-- src/components/EditCampaignModal.vue -->
<template>
  <BaseModal :isOpen="isOpen" title="Edit Campaign" @close="closeModal">
    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="campaignName"
        label="Campaign Name"
        placeholder="Enter campaign name"
      />
      <InputField
        v-model="startXp"
        label="Starting Experience"
        type="number"
        placeholder="0"
      />
      <InputField
        v-model="deathPenaltyMultiplier"
        label="Death Penalty Multiplier (%)"
        type="number"
        placeholder="0"
      />
      <InputField
        v-model="cumulativeGoldEarned"
        label="Cumulative Gold Earned"
        type="number"
        placeholder="0"
      />
      <Button :loading="isSubmitting" variant="primary" class="w-full mt-4">
        Update Campaign
      </Button>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, watch, defineEmits } from "vue";
import InputField from "@/components/Atoms/Input/Input.vue";
import BaseModal from "@/components/Atoms/Modal/Modal.vue";
import Button from "@/components/Atoms/Button/Button.vue";

const emit = defineEmits(["close", "update"]);
const props = defineProps({
  isOpen: Boolean,
  campaign: Object, // Campaign object to be edited
});

const isSubmitting = ref(false);
const campaignName = ref(props.campaign?.campaignName || "");
const startXp = ref(props.campaign?.groupExperience || 0);
const deathPenaltyMultiplier = ref(props.campaign?.deathPenaltyMultiplier || 0);
const cumulativeGoldEarned = ref(props.campaign?.cumulativeGoldEarned || 0);

const closeModal = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  campaignName.value = props.campaign?.campaignName || "";
  startXp.value = props.campaign?.groupExperience || 0;
  deathPenaltyMultiplier.value = props.campaign?.deathPenaltyMultiplier || 0;
  cumulativeGoldEarned.value = props.campaign?.cumulativeGoldEarned || 0;
};

watch(
  () => props.campaign,
  (newCampaign) => {
    if (newCampaign) {
      campaignName.value = newCampaign.campaignName || "";
      startXp.value = newCampaign.groupExperience || 0;
      deathPenaltyMultiplier.value = newCampaign.deathPenaltyMultiplier || 0;
      cumulativeGoldEarned.value = newCampaign.cumulativeGoldEarned || 0;
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  isSubmitting.value = true;
  emit("update", {
    id: props.campaign.id,
    campaignName: campaignName.value,
    groupExperience: startXp.value,
    deathPenaltyMultiplier: deathPenaltyMultiplier.value,
    cumulativeGoldEarned: cumulativeGoldEarned.value,
  });
  isSubmitting.value = false;
  closeModal();
};
</script>
