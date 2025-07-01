package org.example.gender_healthcare_stem.adminservice.controller;

import org.example.gender_healthcare_stem.adminservice.dto.StatisticsDto;
import org.example.gender_healthcare_stem.adminservice.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/overview")
    public ResponseEntity<StatisticsDto.OverviewStats> getOverviewStats() {
        return ResponseEntity.ok(statisticsService.getOverviewStats());
    }

    @GetMapping("/packages/price-distribution")
    public ResponseEntity<List<StatisticsDto.PriceDistribution>> getPackagePriceDistribution() {
        return ResponseEntity.ok(statisticsService.getPackagePriceDistribution());
    }

    @GetMapping("/packages/test-count")
    public ResponseEntity<List<StatisticsDto.PackageTestCount>> getPackageTestCount() {
        return ResponseEntity.ok(statisticsService.getPackageTestCount());
    }

    @GetMapping("/tests/usage")
    public ResponseEntity<List<StatisticsDto.TestUsage>> getTestUsageStats() {
        return ResponseEntity.ok(statisticsService.getTestUsageStats());
    }

    @GetMapping("/tests/price-range")
    public ResponseEntity<List<StatisticsDto.TestPriceRange>> getTestPriceRangeStats() {
        return ResponseEntity.ok(statisticsService.getTestPriceRangeStats());
    }

    @GetMapping("/packages/top-expensive")
    public ResponseEntity<List<StatisticsDto.TopPackage>> getTopExpensivePackages(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(statisticsService.getTopExpensivePackages(limit));
    }

    @GetMapping("/packages/top-popular")
    public ResponseEntity<List<StatisticsDto.TopPackage>> getTopPopularPackages(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(statisticsService.getTopPopularPackages(limit));
    }

    @GetMapping("/monthly-trends")
    public ResponseEntity<List<StatisticsDto.MonthlyTrend>> getMonthlyTrends() {
        return ResponseEntity.ok(statisticsService.getMonthlyTrends());
    }
}