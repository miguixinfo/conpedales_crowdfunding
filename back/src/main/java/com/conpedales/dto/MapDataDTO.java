package com.conpedales.dto;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MapDataDTO {
    private List<StageMapDTO> stages;
    private List<SegmentMapDTO> segments;
    private List<PhotoMapDTO> photos;
    private List<EventMapDTO> events;
}