fn main() {
    let mut complicated_structure = ComplicatedStruct::new();
    complicated_structure.perform_operations();
}

struct ComplicatedStruct {
    data: Vec<i32>,
}

impl ComplicatedStruct {
    fn new() -> Self {
        let mut data = Vec::new();
        for i in 0..100 {
            data.push(i * i);
        }
        ComplicatedStruct { data }
    }

    fn perform_operations(&mut self) {
        self.data.sort();
        self.data.reverse();
        let sum: i32 = self.data.iter().sum();
        println!("Sum of squares: {}", sum);
        self.data = self.data.iter().map(|x| x + 1).collect();
        self.data.dedup();
        self.data.push(sum);
        self.data.sort_unstable();
        self.data.truncate(10);
        self.display_data();
    }

    fn display_data(&self) {
        for (index, value) in self.data.iter().enumerate() {
            println!("Index {}: Value {}", index, value);
        }
    }
}
