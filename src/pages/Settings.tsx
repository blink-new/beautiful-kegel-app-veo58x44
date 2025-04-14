
import { useState } from 'react'
import { useKegel, Exercise, ExerciseType } from '../context/KegelContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Slider } from '../components/ui/slider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, Clock, Dumbbell, Settings2, Sun, Moon } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

const Settings = () => {
  const { exercises, addExercise, updateExercise, deleteExercise } = useKegel()
  const { toast } = useToast()
  
  const [newExercise, setNewExercise] = useState<Omit<Exercise, 'id'>>({
    name: '',
    type: 'quick',
    contractTime: 3,
    relaxTime: 3,
    repetitions: 10
  })
  
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  
  const handleAddExercise = () => {
    if (!newExercise.name) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your exercise.",
        variant: "destructive"
      })
      return
    }
    
    addExercise(newExercise)
    
    toast({
      title: "Exercise Added",
      description: "Your new exercise has been created successfully."
    })
    
    // Reset form
    setNewExercise({
      name: '',
      type: 'quick',
      contractTime: 3,
      relaxTime: 3,
      repetitions: 10
    })
  }
  
  const handleUpdateExercise = () => {
    if (!editingExercise) return
    
    if (!editingExercise.name) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your exercise.",
        variant: "destructive"
      })
      return
    }
    
    updateExercise(editingExercise.id, editingExercise)
    
    toast({
      title: "Exercise Updated",
      description: "Your exercise has been updated successfully."
    })
    
    setEditingExercise(null)
  }
  
  const handleDeleteExercise = (id: string) => {
    deleteExercise(id)
    
    toast({
      title: "Exercise Deleted",
      description: "Your exercise has been deleted."
    })
  }
  
  const formatTime = (seconds: number) => {
    return `${seconds} sec`
  }
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-slate-600 dark:text-slate-300">Customize your exercises</p>
      </div>
      
      <Tabs defaultValue="exercises" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="exercises" className="flex items-center">
            <Dumbbell className="h-4 w-4 mr-2" />
            Exercises
          </TabsTrigger>
          <TabsTrigger value="app" className="flex items-center">
            <Settings2 className="h-4 w-4 mr-2" />
            App Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="exercises" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Your Exercises</h2>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  New Exercise
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Exercise</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Exercise Name</Label>
                    <Input 
                      id="name" 
                      value={newExercise.name} 
                      onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                      placeholder="e.g., Quick Contractions"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Exercise Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['quick', 'endurance', 'custom'] as ExerciseType[]).map(type => (
                        <Button
                          key={type}
                          type="button"
                          variant={newExercise.type === type ? "default" : "outline"}
                          onClick={() => setNewExercise({...newExercise, type})}
                          className="capitalize"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="contract-time">Contract Time</Label>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {formatTime(newExercise.contractTime)}
                      </span>
                    </div>
                    <Slider 
                      id="contract-time"
                      min={1}
                      max={20}
                      step={1}
                      value={[newExercise.contractTime]}
                      onValueChange={(value) => setNewExercise({...newExercise, contractTime: value[0]})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="relax-time">Relax Time</Label>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {formatTime(newExercise.relaxTime)}
                      </span>
                    </div>
                    <Slider 
                      id="relax-time"
                      min={1}
                      max={20}
                      step={1}
                      value={[newExercise.relaxTime]}
                      onValueChange={(value) => setNewExercise({...newExercise, relaxTime: value[0]})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="repetitions">Repetitions</Label>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {newExercise.repetitions} reps
                      </span>
                    </div>
                    <Slider 
                      id="repetitions"
                      min={1}
                      max={30}
                      step={1}
                      value={[newExercise.repetitions]}
                      onValueChange={(value) => setNewExercise({...newExercise, repetitions: value[0]})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleAddExercise}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Exercise
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <motion.div 
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {exercises.map((exercise) => (
              <motion.div key={exercise.id} variants={item}>
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{exercise.name}</CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                          {exercise.type} • {exercise.repetitions} reps
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Exercise</DialogTitle>
                            </DialogHeader>
                            {editingExercise && (
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Exercise Name</Label>
                                  <Input 
                                    id="edit-name" 
                                    value={editingExercise.name} 
                                    onChange={(e) => setEditingExercise({...editingExercise, name: e.target.value})}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Exercise Type</Label>
                                  <div className="grid grid-cols-3 gap-2">
                                    {(['quick', 'endurance', 'custom'] as ExerciseType[]).map(type => (
                                      <Button
                                        key={type}
                                        type="button"
                                        variant={editingExercise.type === type ? "default" : "outline"}
                                        onClick={() => setEditingExercise({...editingExercise, type})}
                                        className="capitalize"
                                      >
                                        {type}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <Label htmlFor="edit-contract-time">Contract Time</Label>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                      {formatTime(editingExercise.contractTime)}
                                    </span>
                                  </div>
                                  <Slider 
                                    id="edit-contract-time"
                                    min={1}
                                    max={20}
                                    step={1}
                                    value={[editingExercise.contractTime]}
                                    onValueChange={(value) => setEditingExercise({...editingExercise, contractTime: value[0]})}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <Label htmlFor="edit-relax-time">Relax Time</Label>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                      {formatTime(editingExercise.relaxTime)}
                                    </span>
                                  </div>
                                  <Slider 
                                    id="edit-relax-time"
                                    min={1}
                                    max={20}
                                    step={1}
                                    value={[editingExercise.relaxTime]}
                                    onValueChange={(value) => setEditingExercise({...editingExercise, relaxTime: value[0]})}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <Label htmlFor="edit-repetitions">Repetitions</Label>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                      {editingExercise.repetitions} reps
                                    </span>
                                  </div>
                                  <Slider 
                                    id="edit-repetitions"
                                    min={1}
                                    max={30}
                                    step={1}
                                    value={[editingExercise.repetitions]}
                                    onValueChange={(value) => setEditingExercise({...editingExercise, repetitions: value[0]})}
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button onClick={handleUpdateExercise}>
                                  <Save className="h-4 w-4 mr-2" />
                                  Save Changes
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Delete Exercise</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <p>Are you sure you want to delete "{exercise.name}"? This action cannot be undone.</p>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleDeleteExercise(exercise.id)}
                                >
                                  Delete
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Contract</p>
                        <p className="text-sm font-medium">{exercise.contractTime}s</p>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Relax</p>
                        <p className="text-sm font-medium">{exercise.relaxTime}s</p>
                      </div>
                      
                      <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-lg text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Total Time</p>
                        <p className="text-sm font-medium">
                          {formatTime((exercise.contractTime + exercise.relaxTime) * exercise.repetitions)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="app" className="space-y-4">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>App Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notifications">Notifications</Label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="notifications" 
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="notifications" className="text-sm font-normal">
                    Enable exercise reminders
                  </Label>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Coming soon: Get reminders to complete your daily exercises
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="justify-start">
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button variant="default" className="justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <circle cx="12" cy="12" r="4"/>
                      <path d="M12 2v2"/>
                      <path d="M12 20v2"/>
                      <path d="m4.93 4.93 1.41 1.41"/>
                      <path d="m17.66 17.66 1.41 1.41"/>
                      <path d="M2 12h2"/>
                      <path d="M20 12h2"/>
                      <path d="m6.34 17.66-1.41 1.41"/>
                      <path d="m19.07 4.93-1.41 1.41"/>
                    </svg>
                    System
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>About</Label>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  KegelFit v1.0.0
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  A beautiful app designed to guide you through Kegel exercises for pelvic floor strength.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Settings