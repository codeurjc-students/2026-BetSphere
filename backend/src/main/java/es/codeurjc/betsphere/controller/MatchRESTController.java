package es.codeurjc.betsphere.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.codeurjc.betsphere.dto.MatchDTO;
import es.codeurjc.betsphere.dto.MatchMapper;
import es.codeurjc.betsphere.repository.MatchRepository;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/v1/matches")

public class MatchRESTController {
    
    private final MatchRepository matchRepo;
    private final MatchMapper mapper;

    public MatchRESTController(MatchRepository matchRepo, MatchMapper mapper){
        this.matchRepo = matchRepo;
        this.mapper = mapper;
    }

    @GetMapping("/")
    public List<MatchDTO> getMatches() {
        return mapper.toDTOs(matchRepo.findAll());
    }
    
}
