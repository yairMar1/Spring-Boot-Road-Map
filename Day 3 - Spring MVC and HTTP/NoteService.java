package com.example.spring_mvc_and_http;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class NoteService {

    private final List<NoteDTO> notes =  new ArrayList<>();

    public void addNote(NoteDTO note) {
        notes.add(note);
    }

    public List<NoteDTO> getNotes() {
        return notes;
    }

    public NoteDTO getNoteByID(UUID id) {
        for (NoteDTO note : notes){
            if (note.getId().equals(id)){
                return note;
            }
        }
        return null;
    }

    public NoteDTO getNoteByTitle(String title) {
        for (NoteDTO note : notes){
            if (note.getTitle().equals(title)){
                return note;
            }
        }
        return null;
    }
}
