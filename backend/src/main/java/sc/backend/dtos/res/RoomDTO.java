package sc.backend.dtos.res;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RoomDTO {

    private int roomId;
    private String name;
    private int createdBy;
    private int[] userList;
}
