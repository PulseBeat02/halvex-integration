import cron from 'node-cron'

function scheduleAuthTask() {
    cron.schedule('*/5 * * * *', this::checkServices());
}

function checkServices() {

}