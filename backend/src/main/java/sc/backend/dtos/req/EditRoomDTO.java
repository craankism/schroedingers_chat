package sc.backend.dtos.req;

import lombok.*;

import java.util.Set;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EditRoomDTO {

    private String name;
    private Set<Integer> userIdSet;
}
