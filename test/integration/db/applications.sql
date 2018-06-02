CREATE TABLE cd_applications (
    id character varying NOT NULL,
    name character varying,
    date_of_birth date,
    event_id character varying,
    status  character varying,
    user_id character varying,
    ticket_name character varying,
    ticket_type character varying,
    session_id character varying,
    created character varying,
    deleted boolean,
    attendance timestamp with time zone[],
    dojo_id character varying,
    ticket_id character varying,
    notes character varying,
    order_id uuid,
    CONSTRAINT pk_cd_applications_id PRIMARY KEY (id)
);
