package es.codeurjc.betsphere.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "matches")
public class Match {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String homeTeam;
    private String awayTeam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_team_id")
    private Team homeTeamRef;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "away_team_id")
    private Team awayTeamRef;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id")
    private Competition competition;
    private LocalDateTime matchDate;

    // Match odds
    private Double homeOdds;
    private Double drawOdds;
    private Double awayOdds;
    
    private String gameStatus; // SCHEDULED, PLAYING, FINISHED

    public Match(){
    }

    public Match(String homeTeam, String awayTeam, LocalDateTime matchDate, Double homeOdds, Double drawOdds, Double awayOdds, String gameStatus) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.matchDate = matchDate;
        this.homeOdds = homeOdds;
        this.drawOdds = drawOdds;
        this.awayOdds = awayOdds;
        this.gameStatus = gameStatus;
    }

    // --- GETTERS & SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getHomeTeam() { return homeTeamRef != null ? homeTeamRef.getName() : homeTeam; }
    public void setHomeTeam(String homeTeam) { this.homeTeam = homeTeam; }

    public String getAwayTeam() { return awayTeamRef != null ? awayTeamRef.getName() : awayTeam; }
    public void setAwayTeam(String awayTeam) { this.awayTeam = awayTeam; }
    public Team getHomeTeamRef() { return homeTeamRef; }
    public void setHomeTeamRef(Team homeTeamRef) {
        this.homeTeamRef = homeTeamRef;
        if (homeTeamRef != null) this.homeTeam = homeTeamRef.getName();
    }
    public Team getAwayTeamRef() { return awayTeamRef; }
    public void setAwayTeamRef(Team awayTeamRef) {
        this.awayTeamRef = awayTeamRef;
        if (awayTeamRef != null) this.awayTeam = awayTeamRef.getName();
    }
    public Competition getCompetition() { return competition; }
    public void setCompetition(Competition competition) { this.competition = competition; }

    public LocalDateTime getMatchDate() { return matchDate; }
    public void setMatchDate(LocalDateTime matchDate) { this.matchDate = matchDate; }

    public Double getHomeOdds() { return homeOdds; }
    public void setHomeOdds(Double homeOdds) { this.homeOdds = homeOdds; }

    public Double getDrawOdds() { return drawOdds; }
    public void setDrawOdds(Double drawOdds) { this.drawOdds = drawOdds; }

    public Double getAwayOdds() { return awayOdds; }
    public void setAwayOdds(Double awayOdds) { this.awayOdds = awayOdds; }

    public String getGameStatus() { return gameStatus; }
    public void setGameStatus(String gameStatus) { this.gameStatus = gameStatus; }


}
