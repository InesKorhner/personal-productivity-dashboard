import React, { useEffect } from 'react';
import type { CheckIns, Habit } from '@/types';
import { HabitList } from '@/components/HabitList';
import { AddHabitDialog } from '@/components/AddHabitDialog';

export function HabitTrackerPage() {
  const [habits, setHabits] = React.useState<Habit[]>(() => {
    try {
      const savedHabits = localStorage.getItem('habits');
      return savedHabits ? JSON.parse(savedHabits) : [];
    } catch (error) {
      console.error('Failed to parse habits from localStorage', error);
      return [];
    }
  });

  const [checkIns, setCheckIns] = React.useState<CheckIns>(() => {
    try {
      const saveCheckIns = localStorage.getItem('checkIns');
      return saveCheckIns ? JSON.parse(saveCheckIns) : {};
    } catch (error) {
      console.error('Failed to parse checkIns from localStorage', error);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('checkIns', JSON.stringify(checkIns));
  }, [checkIns]);

  const handleAddHabit = (habit: Habit) => {
    setHabits([...habits, habit]);
  };

  const handleToggleCheckIn = (habitId: string, date: string) => {
    setCheckIns((prev) => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        [date]: !prev[habitId]?.[date]
      }
    }));
  };

  return (
    <div className="mx-auto max-w-4xl px-4">
      <AddHabitDialog onSave={handleAddHabit} />
      <div className="p-6">
        <HabitList
          habits={habits}
          checkIns={checkIns}
          onToggleCheckIn={handleToggleCheckIn}
        />
      </div>
    </div>
  );
}
