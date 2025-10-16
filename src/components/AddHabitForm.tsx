'use client'

import React from 'react'
import type { Habit } from '@/types'
import { CalendarInForm } from './CalendarInForm'

type AddHabitFormProps = {
  onSave: (habit: Habit) => void
  onCancel?: () => void
}

export function AddHabitForm({ onSave, onCancel }: AddHabitFormProps) {
  const [name, setName] = React.useState('')
  const [frequency, setFrequency] = React.useState<Habit['frequency']>('Daily')
  const [section, setSection] = React.useState<Habit['section']>('Morning')
  const [startDate, setStartDate] = React.useState(new Date().toISOString().slice(0, 10))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, frequency, section, startDate })
    setName('')
  }

  return (
    <form className="bg-white p-4 shadow rounded mb-4" onSubmit={handleSubmit}>
      <div className="mb-2">
        <label className="block text-sm font-medium">Habit Name</label>
        <input
          className="border p-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Frequency</label>
        <select
          className="border p-2 w-full rounded"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as Habit['frequency'])}
        >
          <option>Daily</option>
          <option>Weekly</option>
          <option>3x/week</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Section</label>
        <select
          className="border p-2 w-full rounded"
          value={section}
          onChange={(e) => setSection(e.target.value as Habit['section'])}
        >
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Evening</option>
          <option>Other</option>
        </select>
      </div>

      <CalendarInForm
        value={new Date(startDate)}
        onChange={(date) => setStartDate(date.toISOString().slice(0, 10))}
        label="Start Date"
      />

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}


