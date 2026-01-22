Admin/Public Page (Server Component) 
  |--> (READ) --> service.server.ts (Facade) 
                   |--> service.service.ts 
                         |--> service.repository.ts 
                               |--> Mapper (DB Record -> DTO)
                               |--> service.model.ts (DB)

Admin Form (Client Component)
  |--> (WRITE) --> service.action.ts ("use server" bridge)
                    |--> service.server.ts (Facade)
                          |--> (Vahi upar wala flow...)