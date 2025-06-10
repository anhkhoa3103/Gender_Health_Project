package org.example.gender_healthcare_stem.menstrual.service;

import org.example.gender_healthcare_stem.menstrual.dto.CycleHistoryDTO;
import org.example.gender_healthcare_stem.menstrual.dto.MenstrualCycleDTO;
import org.example.gender_healthcare_stem.menstrual.model.MenstrualCycle;
import org.example.gender_healthcare_stem.menstrual.repository.MenstrualCycleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MenstrualCycleService {

    @Autowired
    private MenstrualCycleRepository repository;


    public MenstrualCycle saveCycle(Integer customerId, MenstrualCycleDTO dto) {
        MenstrualCycle cycle = new MenstrualCycle();
        cycle.setCustomerId(customerId);
        cycle.setCycleDate(dto.getCycleDate());
        cycle.setHasPeriod(dto.getHasPeriod());
        cycle.setFlowLevel(dto.getFlowLevel());
        cycle.setPainLevel(dto.getPainLevel());
        cycle.setMoodLevel(dto.getMoodLevel());
        cycle.setHabit(dto.getHabit());
        cycle.setDischargeType(dto.getDischargeType());
        cycle.setWeight(dto.getWeight());
        cycle.setTemperature(dto.getTemperature());
        cycle.setNote(dto.getNote());

        // Service - sau khi lưu ngày đầu, sinh thêm 4 ngày tiếp
        for (int i = 1; i < 5; i++) {
            LocalDate nextDate = dto.getCycleDate().plusDays(i);
            MenstrualCycle next = new MenstrualCycle();
            next.setCustomerId(customerId);
            next.setCycleDate(nextDate);
            next.setHasPeriod(true);
            repository.save(next);
        }
        return repository.save(cycle);
    }

    public MenstrualCycle getCycleByDate(Integer customerId, String date) {
        return repository.findByCustomerIdAndCycleDate(customerId, LocalDate.parse(date));
    }

    public List<MenstrualCycle> getCyclesInMonth(Integer customerId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        System.out.println("Start: " + start + ", End: " + end + ", Customer ID: " + customerId);

        return repository.findByCustomerIdAndCycleDateBetween(customerId, start, end);
    }

    public void saveOrUpdateCycle(int customerId, MenstrualCycleDTO dto) {
        LocalDate date = dto.getCycleDate();
        Optional<MenstrualCycle> optional = repository.findByCustomerIdAndCycleDate(customerId, date);

        boolean isEmpty =
                !dto.getHasPeriod() &&
                        (dto.getFlowLevel() == 0 || dto.getFlowLevel() == null) &&
                        (dto.getPainLevel() == 0 || dto.getPainLevel() == null) &&
                        (dto.getMoodLevel() == 0 || dto.getMoodLevel() == null) &&
                        isBlank(dto.getHabit()) &&
                        isBlank(dto.getDischargeType()) &&
                        dto.getWeight() == null &&
                        dto.getTemperature() == null &&
                        isBlank(dto.getNote());

        if (isEmpty && optional.isPresent()) {
            // ✅ Xóa khỏi DB
            repository.delete(optional.get());
            return;
        }

        // Nếu không thì tạo hoặc cập nhật
        MenstrualCycle cycle = optional.orElse(new MenstrualCycle());
        cycle.setCustomerId(customerId);
        cycle.setCycleDate(date);
        cycle.setHasPeriod(dto.getHasPeriod());
        cycle.setFlowLevel(dto.getFlowLevel());
        cycle.setPainLevel(dto.getPainLevel());
        cycle.setMoodLevel(dto.getMoodLevel());
        cycle.setHabit(dto.getHabit());
        cycle.setDischargeType(dto.getDischargeType());
        cycle.setWeight(dto.getWeight());
        cycle.setTemperature(dto.getTemperature());
        cycle.setNote(dto.getNote());

        repository.save(cycle);
    }

    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    public List<CycleHistoryDTO> getRecentCycles(int customerId) {
        return repository.findRecentCycles(customerId);
    }


}
