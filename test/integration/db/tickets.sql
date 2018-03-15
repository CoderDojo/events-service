CREATE TABLE cd_tickets (
    id character varying NOT NULL,
    session_id character varying,
    name character varying,
    type character varying,
    quantity integer,
    deleted smallint,
    invites json[]
);
