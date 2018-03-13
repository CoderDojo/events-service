CREATE TABLE cd_events (
    id character varying NOT NULL,
    name character varying,
    country json,
    city json,
    address character varying,
    created_at timestamp with time zone,
    created_by character varying,
    type character varying,
    description character varying,
    dojo_id character varying,
    "position" json,
    public boolean,
    status character varying,
    recurring_type character varying,
    dates json[],
    ticket_approval boolean DEFAULT false,
    notify_on_applicant boolean DEFAULT false,
    eventbrite_id character varying,
    eventbrite_url character varying,
    use_dojo_address boolean
);

CREATE VIEW v_event_occurrences AS (
    SELECT id, name, country, city, address, created_at, created_by, type, description, dojo_id, position, public,
    status, recurring_type, dates, ticket_approval, notify_on_applicant, eventbrite_id, eventbrite_url, use_dojo_address,
    start_time::timestamp, end_time::timestamp FROM (
        SELECT *, unnest(dates)->>'startTime' as start_time, unnest(dates)->>'endTime' as end_time FROM cd_events
    ) x WHERE start_time IS NOT NULL AND start_time NOT LIKE 'Invalid%' AND end_time IS NOT NULL AND end_time NOT LIKE 'Invalid%'
);