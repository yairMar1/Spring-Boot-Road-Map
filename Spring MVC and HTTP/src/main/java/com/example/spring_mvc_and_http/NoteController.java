package com.example.spring_mvc_and_http;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping("/notes")
    public ResponseEntity<NoteDTO> createNote(@RequestBody NoteDTO note){
        noteService.addNote(note);
        return ResponseEntity.status(201).body(note);
    }

    //this function does what the two below functions do
    @GetMapping("/notes/{id}")
    public NoteDTO getNotesById(@PathVariable String id){
        return noteService.getNoteByID(java.util.UUID.fromString(id));
    }

//    @GetMapping("/notes/title")
//    public NoteDTO getNote(@RequestParam String title){
//        return noteService.getNoteByTitle(title);
//    }
//    @GetMapping("/notes")
//    public List<NoteDTO> getNotes() {
//        return noteService.getNotes();
//    }

    @GetMapping("/notes")
    public Object getNotes(@RequestParam (required = false) String title){
        if(title != null){
            return noteService.getNoteByTitle(title);
        }
        return noteService.getNotes();
    }

}
