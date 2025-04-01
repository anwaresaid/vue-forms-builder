<template>
  <app-layout>
    <h1>Registration Form Builder</h1>

    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="builder" tab="Form Builder">
        <a-form layout="vertical">
          <a-card title="Fixed Fields" style="margin-bottom: 24px">
            <a-form-item v-for="field in fixedFields" :key="field.name" :label="field.label">
              <a-input :value="field.label" disabled />
              <a-tag color="blue" style="margin-top: 8px">{{ field.type }}</a-tag>
              <a-tag color="green" style="margin-top: 8px">Required</a-tag>
            </a-form-item>
          </a-card>

          <a-card title="Custom Fields" style="margin-bottom: 24px">
            <a-empty v-if="customFields.length === 0" description="No custom fields added yet" />

            <div v-for="(field, index) in customFields" :key="index" class="custom-field">
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="Field Label">
                    <a-input v-model:value="field.label" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="Field Type">
                    <a-select v-model:value="field.type">
                      <a-select-option value="text">Text</a-select-option>
                      <a-select-option value="email">Email</a-select-option>
                      <a-select-option value="number">Number</a-select-option>
                      <a-select-option value="select">Select</a-select-option>
                      <a-select-option value="date">Date</a-select-option>
                      <a-select-option value="textarea">Textarea</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item label="Required">
                    <a-switch v-model:checked="field.required" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="Actions">
                    <a-button type="danger" @click="removeField(index)" style="margin-right: 8px">
                      <template #icon><delete-outlined /></template>
                    </a-button>
                    <a-button
                      @click="moveField(index, index - 1)"
                      :disabled="index === 0"
                      style="margin-right: 8px"
                    >
                      <template #icon><arrow-up-outlined /></template>
                    </a-button>
                    <a-button
                      @click="moveField(index, index + 1)"
                      :disabled="index === customFields.length - 1"
                    >
                      <template #icon><arrow-down-outlined /></template>
                    </a-button>
                  </a-form-item>
                </a-col>
              </a-row>

              <!-- Options for select type -->
              <a-row v-if="field.type === 'select'">
                <a-col :span="24">
                  <a-form-item label="Options (comma separated)">
                    <a-input
                      v-model:value="field.options"
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-divider v-if="index < customFields.length - 1" />
            </div>

            <a-button type="dashed" block @click="addField" style="margin-top: 16px">
              <template #icon><plus-outlined /></template>
              Add Field
            </a-button>
          </a-card>

          <a-form-item>
            <a-button type="primary" @click="saveForm" :loading="saving"> Save Form </a-button>
            <a-button style="margin-left: 8px" @click="activeTab = 'preview'">
              Preview Form
            </a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="preview" tab="Form Preview">
        <a-card title="Registration Form Preview">
          <a-form layout="vertical">
            <a-form-item
              v-for="field in [...fixedFields, ...customFields]"
              :key="field.name || field.label"
              :label="field.label"
              :required="field.required"
            >
              <!-- Text input -->
              <a-input v-if="field.type === 'text'" placeholder="Enter text" />

              <!-- Email input -->
              <a-input v-else-if="field.type === 'email'" type="email" placeholder="Enter email" />

              <!-- Number input -->
              <a-input-number v-else-if="field.type === 'number'" style="width: 100%" />

              <!-- Select input -->
              <a-select
                v-else-if="field.type === 'select'"
                placeholder="Select an option"
                style="width: 100%"
              >
                <a-select-option
                  v-for="(option, i) in (field.options || '').split(',').map((o) => o.trim())"
                  :key="i"
                  :value="option"
                >
                  {{ option }}
                </a-select-option>
              </a-select>

              <!-- Date input -->
              <a-date-picker v-else-if="field.type === 'date'" style="width: 100%" />

              <!-- Textarea input -->
              <a-textarea
                v-else-if="field.type === 'textarea'"
                :rows="4"
                placeholder="Enter text"
              />

              <!-- Default to text input -->
              <a-input v-else placeholder="Enter text" />
            </a-form-item>

            <a-form-item>
              <a-button type="primary">Submit</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </app-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import AppLayout from '../components/AppLayout.vue'
import {
  DeleteOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons-vue'

const activeTab = ref('builder')
const saving = ref(false)

// Fixed fields that cannot be edited or removed
const fixedFields = ref([
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
])

// Custom fields that can be added, edited, and removed
const customFields = ref([])

onMounted(() => {
  // Load saved form if exists
  const savedForm = localStorage.getItem('registration_form')
  if (savedForm) {
    try {
      const formData = JSON.parse(savedForm)
      customFields.value = formData.customFields || []
    } catch (error) {
      console.error('Error loading saved form:', error)
    }
  }
})

const addField = () => {
  customFields.value.push({
    label: 'New Field',
    type: 'text',
    required: false,
    options: '',
  })
}

const removeField = (index) => {
  customFields.value.splice(index, 1)
}

const moveField = (fromIndex, toIndex) => {
  if (toIndex < 0 || toIndex >= customFields.value.length) return

  const field = customFields.value[fromIndex]
  customFields.value.splice(fromIndex, 1)
  customFields.value.splice(toIndex, 0, field)
}

const saveForm = () => {
  saving.value = true

  // Validate form fields
  const invalidFields = customFields.value.filter((field) => !field.label.trim())
  if (invalidFields.length > 0) {
    message.error('All fields must have a label')
    saving.value = false
    return
  }

  // Simulate API call
  setTimeout(() => {
    try {
      const formData = {
        fixedFields: fixedFields.value,
        customFields: customFields.value,
      }

      localStorage.setItem('registration_form', JSON.stringify(formData))
      message.success('Form saved successfully')
    } catch (error) {
      console.error('Error saving form:', error)
      message.error('Failed to save form')
    } finally {
      saving.value = false
    }
  }, 1000)
}
</script>

<style scoped>
.custom-field {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 4px;
}
</style>
