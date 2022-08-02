-- таблица объектов
create table objects
(
    "objectId"   serial
        constraint objects_pk
            primary key,
    "fileUrl"    text,
    "objectName" text
);

-- -- поменяйте gelmutr на того, кто будет DB_USER, и раскомментируйте
-- alter table objects
--     owner to gelmutr;

create unique index objects_objectid_uindex
    on objects ("objectId");

-- таблица (множественных) файлов
create table files
(
    "fileId"   serial
        constraint files_pk
            primary key,
    "objectId" integer not null
        constraint files_objects_objectid_fk
            references objects
            on delete set null,
    "fileUrl"  text    not null
);

-- -- поменяйте gelmutr на того, кто будет DB_USER, и раскомментируйте
-- alter table files
--     owner to gelmutr;

create unique index files_fileid_uindex
    on files ("fileId");