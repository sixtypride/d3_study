import BarChart from "./example/BarChart";


class Main {
    constructor() {
        // (참고) 클래스 내에 일반 함수가 없을경우 IE8에서 uglify를 하면 에러가 발생한다.
        this.init();
    }
    init() {
        let chart = new BarChart();
    }
}
export default Main;
window.nts.ria.Main = Main;